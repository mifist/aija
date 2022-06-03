(function podcastMedia() {
  "use strict";

  const options = {
    defaultSpeed: '1.00',
    loop: false,
    features: [
      "playpause",
      "progress",
      "current",
      "duration"
    ]
  }

  const podcastsPlayer = document.querySelectorAll(".mejs__podcast");

  podcastsPlayer.forEach(function(podcastAudio) {
    let player = new MediaElementPlayer(
      podcastAudio,
      options
    );

 /*    console.log('podcastAudio', podcastAudio);
    console.log('player', player); */
  
    /* const elementTop = document.createElement('div');
      const elementBottom = document.createElement('div');
      elementTop.classList.add('mejs-prepended-buttons');
      elementBottom.classList.add('mejs-appended-buttons');
  
    const controls = player.controls;
   
     //const controls = document.querySelector('.mejs__controls');
      controls.prepend(elementTop);
      controls.append(elementBottom);
      
      const controlsChildren = Array.from(controls.childNodes).filter(v => v.className.startsWith("mejs__"));
      console.log(controlsChildren)
      controlsChildren.slice(0, 3).forEach(elem => {
        elementTop.append(elem)
      });
      
      controlsChildren.slice(3, controlsChildren.length).forEach(elem => {
        elementBottom.append(elem)
      }) */
  });



})();
