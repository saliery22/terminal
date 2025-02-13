if(window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientationabsolute', function(event) {
    var alpha;
    // Check for iOS property
    if(event.webkitCompassHeading) {
      alpha = event.webkitCompassHeading;
    if (my_icon){ my_icon.setRotationAngle(360-alpha);}
    }
    // non iOS
    else {

      alpha = -(event.alpha + event.beta * event.gamma / 90);
      alpha -= Math.floor(alpha / 360) * 360; // Wrap into range [0,360].
      if(!window.chrome) {
        // Assume Android stock
         //alpha = alpha+270; 
      }

      if (my_icon){ my_icon.setRotationAngle(alpha);}
    }
  });
}
