import cv2
import numpy as np

def vectorize():
    # Load the logo image
    img = cv2.imread('../sample/logo.jpg')
    if img is None:
        print("Error: Could not load logo.jpg")
        return
        
    h, w, c = img.shape
    print(f"Original image size: {w}x{h}")
    
    # We want to crop out "CULTURE SCHOOL" at the bottom.
    # Let's inspect where "CULTURE SCHOOL" is. Typically, in a 900x900 logo,
    # "SUNBRIDGE" is around y=550-620, and "CULTURE SCHOOL" is around y=630-700.
    # Let's crop the image at y = 620 to be safe, preserving the graphic and "SUNBRIDGE"
    # but excluding "CULTURE SCHOOL". Let's verify coordinates.
    # We will slice the image from y=0 to y=620 (or y=615).
    # Let's check the distribution of black pixels at the bottom to find the crop line dynamically!
    
    # Convert to grayscale to locate black pixels easily
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Threshold for black text/graphic
    _, black_mask = cv2.threshold(gray, 80, 255, cv2.THRESH_BINARY_INV)
    
    # Let's find rows containing black pixels
    row_sums = np.sum(black_mask, axis=1)
    
    # Find active rows from bottom up
    active_rows = np.where(row_sums > 0)[0]
    
    # Let's print out the bands of black pixels to locate "SUNBRIDGE" and "CULTURE SCHOOL"
    # "CULTURE SCHOOL" is the bottom-most band.
    # Let's find the gap between "SUNBRIDGE" and "CULTURE SCHOOL".
    # We can scan rows from the bottom of the active rows
    bottom_y = active_rows[-1]
    print(f"Bottom-most black pixel row: {bottom_y}")
    
    # Let's look for a gap of white rows (sum == 0 or very small) between the two texts.
    gap_y = None
    for y in range(bottom_y, 0, -1):
        if row_sums[y] < 255 * 5: # very few black pixels
            # check if there was a band of black pixels below this, and a band of black pixels above this
            below_has_black = np.any(row_sums[y:bottom_y+1] > 255 * 10)
            above_has_black = np.any(row_sums[y-50:y] > 255 * 10)
            if below_has_black and above_has_black:
                gap_y = y
                break
                
    if gap_y is not None:
        print(f"Found gap between SUNBRIDGE and CULTURE SCHOOL at y={gap_y}")
        crop_y = gap_y
    else:
        # Fallback to manual crop
        crop_y = int(h * 0.68) # crop bottom 32%
        print(f"No clear gap found. Using fallback crop at y={crop_y}")
        
    # Crop the image
    cropped_img = img[0:crop_y, :]
    cropped_gray = gray[0:crop_y, :]
    
    # We will segment the image by color:
    # 1. Black Elements (Child, Bridge, and "SUNBRIDGE" text)
    # 2. Orange/Yellow Elements (Sun, Rays)
    
    # BGR Thresholding:
    # Black is low in all channels: B < 100, G < 100, R < 100
    black_mask = (cropped_img[:,:,0] < 100) & (cropped_img[:,:,1] < 100) & (cropped_img[:,:,2] < 100)
    black_mask = (black_mask * 255).astype(np.uint8)
    
    # Orange is high in R, moderate in G, low in B: R > 150, G > 80, B < 120
    # Let's use HSV for a cleaner segmentation
    hsv = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2HSV)
    # Orange hue is around 10-25
    lower_orange = np.array([5, 80, 80])
    upper_orange = np.array([30, 255, 255])
    orange_mask = cv2.inRange(hsv, lower_orange, upper_orange)
    
    # Clean masks using morphological opening
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2,2))
    black_mask = cv2.morphologyEx(black_mask, cv2.MORPH_OPEN, kernel)
    orange_mask = cv2.morphologyEx(orange_mask, cv2.MORPH_OPEN, kernel)
    
    # Find contours
    # cv2.RETR_CCOMP retrieves all contours and organizes them into a two-level hierarchy:
    # external boundaries and holes. This is critical for drawing letters (like 'R', 'B', 'D', 'O', 'A') 
    # and the child's face/smile cutout!
    black_contours, black_hierarchy = cv2.findContours(black_mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    orange_contours, orange_hierarchy = cv2.findContours(orange_mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    
    # Helper to convert contour to SVG path d-string
    def contour_to_svg_path(contour):
        path_str = ""
        for i, pt in enumerate(contour):
            x, y = pt[0]
            if i == 0:
                path_str += f"M {x} {y}"
            else:
                path_str += f" L {x} {y}"
        path_str += " Z"
        return path_str
        
    # We will build the SVG XML content.
    # The cropped height is crop_y. The original width is w.
    svg_w = w
    svg_h = crop_y
    
    svg_content = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_w} {svg_h}" width="100%" height="100%">',
        '  <defs>',
        '    <!-- Styles for visual crispness -->',
        '    <style>',
        '      .bg-white { fill: none; }',
        '      .logo-black { fill: #000000; fill-rule: evenodd; }',
        '      .logo-orange { fill: #f28f3b; fill-rule: evenodd; }',
        '    </style>',
        '  </defs>',
        '  <!-- Background -->',
        f'  <rect width="{svg_w}" height="{svg_h}" class="bg-white" />'
    ]
    
    # Write Orange paths
    # If a contour has a parent (i.e. it is a hole inside an orange shape), we handle it using evenodd fill rule.
    # SVG fill-rule="evenodd" allows us to combine outer contours and inner holes in a single <path> tag!
    # Let's group outer and inner contours.
    orange_paths = []
    if len(orange_contours) > 0:
        for i, cnt in enumerate(orange_contours):
            # Simplify contour slightly to keep SVG size small and lines smooth
            epsilon = 0.0008 * cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, epsilon, True)
            if cv2.contourArea(approx) > 2: # filter out tiny noise particles
                orange_paths.append(contour_to_svg_path(approx))
                
        if orange_paths:
            combined_path = " ".join(orange_paths)
            svg_content.append(f'  <path d="{combined_path}" class="logo-orange" />')
            
    # Write Black paths (including text and graphic)
    black_paths = []
    if len(black_contours) > 0:
        for i, cnt in enumerate(black_contours):
            # Simplify contour slightly
            epsilon = 0.0008 * cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, epsilon, True)
            if cv2.contourArea(approx) > 2:
                black_paths.append(contour_to_svg_path(approx))
                
        if black_paths:
            combined_path = " ".join(black_paths)
            svg_content.append(f'  <path d="{combined_path}" class="logo-black" />')
            
    svg_content.append('</svg>')
    
    # Save the output file
    output_path = '../images/logo.svg'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(svg_content))
        
    print(f"Successfully generated vector logo and saved to {output_path}")

if __name__ == "__main__":
    vectorize()
