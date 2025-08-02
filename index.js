function drawFoldEdges(scaleFactor = 1) {
            if (!originalImage) return;
        
            // Initialize original dimensions if not set
            if (originalWidthValue === null) {
                originalWidthValue = widthValue;
            }
            if (originalHeightValue === null) {
                originalHeightValue = heightValue;
            }
        
            // FIXED CANVAS SIZE
            const FIXED_CANVAS_WIDTH = 500;
            const FIXED_CANVAS_HEIGHT = 300;
            
            // Constants for folds
            const minFoldSize = 15;
            const avgFoldSize = 30;
            const maxFoldSize = 70;
            const gapSize = 3;
            const outerSpacing = 20;
        
            // IMAGE SIZE REDUCTION FACTOR - Adjust this to make image smaller
            const IMAGE_SIZE_FACTOR = 0.8; // This will make the image 60% of its calculated size
        
            // Calculate fold size
            const inverseFactor = 1 / scaleFactor;
            let foldSize = Math.min(maxFoldSize, Math.max(minFoldSize, avgFoldSize * inverseFactor));
        
            // Calculate space taken by folds and gaps
            const foldSpaceWidth = 
                (edgeFoldLeft.checked ? foldSize + gapSize : 0) + 
                (edgeFoldRight.checked ? foldSize + gapSize : 0);
            
            const foldSpaceHeight = 
                (edgeFoldTop.checked ? foldSize + gapSize : 0) + 
                (edgeFoldBottom.checked ? foldSize + gapSize : 0);
        
            // Calculate available space for image after folds and spacing
            const availableWidth = FIXED_CANVAS_WIDTH - foldSpaceWidth - (outerSpacing * 2);
            const availableHeight = FIXED_CANVAS_HEIGHT - foldSpaceHeight - (outerSpacing * 2);
            
            // Scale image to fit within available space while maintaining aspect ratio
            const imageAspectRatio = originalImage.width / originalImage.height;
            let imgWidth, imgHeight;
        
            // Determine which dimension is the limiting factor
            const widthScale = availableWidth / originalImage.width;
            const heightScale = availableHeight / originalImage.height;
            const scale = Math.min(widthScale, heightScale);
        
            // Apply the additional size reduction factor
            imgWidth = originalImage.width * scale * IMAGE_SIZE_FACTOR;
            imgHeight = originalImage.height * scale * IMAGE_SIZE_FACTOR;
        
            // Set fixed canvas size
            canvas.width = FIXED_CANVAS_WIDTH;
            canvas.height = FIXED_CANVAS_HEIGHT;
        
            // Clear and set fill style
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = dominantColor || "#aaa";
        
            // Calculate image position (centered within available space)
            const baseX = outerSpacing + (edgeFoldLeft.checked ? foldSize + gapSize : 0);
            const baseY = outerSpacing + (edgeFoldTop.checked ? foldSize + gapSize : 0);
            
            const x = baseX + (availableWidth - imgWidth) / 2;
            const y = baseY + (availableHeight - imgHeight) / 2;
        
            // Draw main image
            if (imgWidth > 0 && imgHeight > 0) {
                ctx.drawImage(originalImage, x, y, imgWidth, imgHeight);
            }
        
            // Draw folds (adjusted to work with centered image)
            if (edgeFoldTop.checked) {
                ctx.beginPath();
                ctx.moveTo(x, y - gapSize);
                ctx.lineTo(x + imgWidth, y - gapSize);
                ctx.lineTo(x + imgWidth + foldSize, y - gapSize - foldSize);
                ctx.lineTo(x + foldSize, y - gapSize - foldSize);
                ctx.closePath();
                ctx.fill();
            }
        
            if (edgeFoldBottom.checked) {
                ctx.beginPath();
                ctx.moveTo(x, y + imgHeight + gapSize);
                ctx.lineTo(x + imgWidth, y + imgHeight + gapSize);
                ctx.lineTo(x + imgWidth + foldSize, y + imgHeight + gapSize + foldSize);
                ctx.lineTo(x + foldSize, y + imgHeight + gapSize + foldSize);
                ctx.closePath();
                ctx.fill();
            }
        
            if (edgeFoldLeft.checked) {
                ctx.beginPath();
                ctx.moveTo(x - gapSize, y);
                ctx.lineTo(x - gapSize, y + imgHeight);
                ctx.lineTo(x - gapSize - foldSize, y + imgHeight + foldSize);
                ctx.lineTo(x - gapSize - foldSize, y + foldSize);
                ctx.closePath();
                ctx.fill();
            }
        
            if (edgeFoldRight.checked) {
                ctx.beginPath();
                ctx.moveTo(x + imgWidth + gapSize, y);
                ctx.lineTo(x + imgWidth + gapSize, y + imgHeight);
                ctx.lineTo(x + imgWidth + gapSize + foldSize, y + imgHeight + foldSize);
                ctx.lineTo(x + imgWidth + gapSize + foldSize, y + foldSize);
                ctx.closePath();
                ctx.fill();
            }
        
            // Calculate dimensions in cm
            const foldSizeCm = foldSize / 10;
            const coreWidthCm = (imgWidth / originalImage.width) * originalWidthValue;
            const coreHeightCm = (imgHeight / originalImage.height) * originalHeightValue;
        
            widthValue = coreWidthCm;
            heightValue = coreHeightCm;
        
            if (edgeFoldLeft.checked) widthValue += foldSizeCm;
            if (edgeFoldRight.checked) widthValue += foldSizeCm;
            if (edgeFoldTop.checked) heightValue += foldSizeCm;
            if (edgeFoldBottom.checked) heightValue += foldSizeCm;
        
            widthValue = Math.min(MAX_CM, Math.max(MIN_CM, widthValue));
            heightValue = Math.min(MAX_CM, Math.max(MIN_CM, heightValue));
        
            updateDimensionInputs();
            updateSizeReadout();
            updatePreviewSewingAllowance();
            updatePrice();
            checkReady();
            debouncedCollectLineItemProperties();
        }    




















function drawFoldEdges(scaleFactor = 1) {
  if (!originalImage) return;

  // Initialize original dimensions if not set
  if (originalWidthValue === null) {
    originalWidthValue = widthValue;
  }
  if (originalHeightValue === null) {
    originalHeightValue = heightValue;
  }

  // Constants - INCREASED for better visual scaling
  const minFoldSize = 15; // INCREASED from 10
  const avgFoldSize = 80; // INCREASED from 60
  const maxFoldSize = 150; // INCREASED from 120
  const minImageSize = 250; // INCREASED from 200
  const maxImageSize = 450; // INCREASED from 350
  const gapSize = 3;
  const outerSpacing = 140; // INCREASED from 120

  // Calculate scaled image dimensions
  let imgWidth = originalImage.width * scaleFactor;
  let imgHeight = originalImage.height * scaleFactor;

  // Enforce minimum image size
  if (imgWidth < minImageSize || imgHeight < minImageSize) {
    const scaleUp = Math.max(minImageSize / imgWidth, minImageSize / imgHeight);
    imgWidth *= scaleUp;
    imgHeight *= scaleUp;
  }

  // Clamp image size to maxImageSize
  const imageScaleLimit = Math.min(
    maxImageSize / imgWidth,
    maxImageSize / imgHeight,
    1
  );
  imgWidth *= imageScaleLimit;
  imgHeight *= imageScaleLimit;

  // Calculate fold size with min/max constraints
  const inverseFactor = 1 / scaleFactor;
  let foldSize = Math.min(
    maxFoldSize,
    Math.max(minFoldSize, avgFoldSize * inverseFactor)
  );

  // Calculate canvas dimensions
  const canvasWidth =
    imgWidth +
    (edgeFoldLeft.checked ? foldSize + gapSize : 0) +
    (edgeFoldRight.checked ? foldSize + gapSize : 0) +
    outerSpacing * 2;

  const canvasHeight =
    imgHeight +
    (edgeFoldTop.checked ? foldSize + gapSize : 0) +
    (edgeFoldBottom.checked ? foldSize + gapSize : 0) +
    outerSpacing * 2;

  // Set canvas size
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = dominantColor || "#aaa";

  // Calculate image position (accounting for folds and spacing)
  const x = outerSpacing + (edgeFoldLeft.checked ? foldSize + gapSize : 0);
  const y = outerSpacing + (edgeFoldTop.checked ? foldSize + gapSize : 0);

  // Draw main image (only if it will be visible)
  if (imgWidth > 0 && imgHeight > 0) {
    ctx.drawImage(originalImage, x, y, imgWidth, imgHeight);
  }

  // Draw folds
  if (edgeFoldTop.checked) {
    ctx.beginPath();
    ctx.moveTo(x, y - gapSize);
    ctx.lineTo(x + imgWidth, y - gapSize);
    ctx.lineTo(x + imgWidth + foldSize, y - gapSize - foldSize);
    ctx.lineTo(x + foldSize, y - gapSize - foldSize);
    ctx.closePath();
    ctx.fill();
  }

  if (edgeFoldBottom.checked) {
    ctx.beginPath();
    ctx.moveTo(x, y + imgHeight + gapSize);
    ctx.lineTo(x + imgWidth, y + imgHeight + gapSize);
    ctx.lineTo(x + imgWidth + foldSize, y + imgHeight + gapSize + foldSize);
    ctx.lineTo(x + foldSize, y + imgHeight + gapSize + foldSize);
    ctx.closePath();
    ctx.fill();
  }

  if (edgeFoldLeft.checked) {
    ctx.beginPath();
    ctx.moveTo(x - gapSize, y);
    ctx.lineTo(x - gapSize, y + imgHeight);
    ctx.lineTo(x - gapSize - foldSize, y + imgHeight + foldSize);
    ctx.lineTo(x - gapSize - foldSize, y + foldSize);
    ctx.closePath();
    ctx.fill();
  }

  if (edgeFoldRight.checked) {
    ctx.beginPath();
    ctx.moveTo(x + imgWidth + gapSize, y);
    ctx.lineTo(x + imgWidth + gapSize, y + imgHeight);
    ctx.lineTo(x + imgWidth + gapSize + foldSize, y + imgHeight + foldSize);
    ctx.lineTo(x + imgWidth + gapSize + foldSize, y + foldSize);
    ctx.closePath();
    ctx.fill();
  }

  // Calculate dimensions in cm
  const foldSizeCm = foldSize / 10;
  const coreWidthCm = (imgWidth / originalImage.width) * originalWidthValue;
  const coreHeightCm = (imgHeight / originalImage.height) * originalHeightValue;

  // Update dimensions
  widthValue = coreWidthCm;
  heightValue = coreHeightCm;

  if (edgeFoldLeft.checked) widthValue += foldSizeCm;
  if (edgeFoldRight.checked) widthValue += foldSizeCm;
  if (edgeFoldTop.checked) heightValue += foldSizeCm;
  if (edgeFoldBottom.checked) heightValue += foldSizeCm;

  // Apply constraints
  widthValue = Math.min(MAX_CM, Math.max(MIN_CM, widthValue));
  heightValue = Math.min(MAX_CM, Math.max(MIN_CM, heightValue));

  // Update UI
  updateDimensionInputs();
  updateSizeReadout();
  updatePreviewSewingAllowance();
  updatePrice();
  checkReady();
  debouncedCollectLineItemProperties();
}
const edgeFoldTop = document.getElementById("edgeFoldTop");
const edgeFoldRight = document.getElementById("edgeFoldRight");
const edgeFoldBottom = document.getElementById("edgeFoldBottom");
const edgeFoldLeft = document.getElementById("edgeFoldLeft");

[edgeFoldTop, edgeFoldRight, edgeFoldBottom, edgeFoldLeft].forEach(
  (checkbox) => {
    checkbox.addEventListener("change", () => {
      // Update sewingAllowanceState based on checkbox state
      edgeFoldState.top = edgeFoldTop.checked;
      edgeFoldState.bottom = edgeFoldRight.checked;
      edgeFoldState.left = edgeFoldBottom.checked;
      edgeFoldState.right = edgeFoldLeft.checked;

      // If no pads are checked, reset original dimensions
      const noPadsChecked =
        !edgeFoldTop.checked &&
        !edgeFoldRight.checked &&
        !edgeFoldBottom.checked &&
        !edgeFoldLeft.checked;

      if (noPadsChecked) {
        // Reset to the last recorded original dimensions
        if (originalWidthValue !== null) {
          widthValue = originalWidthValue;
        }
        if (originalHeightValue !== null) {
          heightValue = originalHeightValue;
        }

        // Reset the tracking variables
        originalWidthValue = null;
        originalHeightValue = null;
      }

      drawFoldEdges();

      // Explicitly call updatePrice to ensure it reflects the current state
      updatePrice();
    });
  }
);
