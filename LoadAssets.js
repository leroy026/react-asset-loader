var LoadAssets = React.createClass({
  getInitialState: function () {
    // 'loaded' state by default is false
    return {loaded: false};
  },

  componentDidMount: function () {
    var 
      _self = this, 
      totalAssets = this.props.assets.length, 
      loadedAssets = 0
    ;

    // Start loading all the assets
    Array.prototype.forEach.call(this.props.assets, function(asset) {
      _self.loadAsset(asset.uri, function(e) {
        loadedAssets++;
        if (loadedAssets == totalAssets) {
          // when all the assets are loaded set state 'loaded' to true
          _self.setState({loaded: true});

          // when all the assets are loaded call the callback function if any
          if (typeof(_self.props.onLoad) === "function") _self.props.onLoad();
        }
      });
    });
  },

  loadAsset: function(uri, callback) {
    // preload if asset is image
    if (uri.toLowerCase().match("jpg|jpeg|gif|png|webp") !== null) {
      var image = new Image();
      image.src = uri;
      image.onload = callback;
    }

    // preload if asset is video
    if (uri.toLowerCase().match("mp4|webm|ogv") !== null) {
      var video = document.createElement('video');
      var source = document.createElement('source'); 
      source.src = uri;
      video.setAttribute("preload", "auto");
      video.appendChild(source);
      video.addEventListener('canplaythrough', callback, false);
    }
  }, 

  render: function() {
    var output = [];

    if (!this.state.loaded) {
      // asset not loaded yet - loading UI
      output.push(<div className="loading"></div>);
    } else {
      // asset fully loaded - show asset
      var assets = this.props.assets.map(function(asset) {
        var assetOutput;
        // it's an image
        if (asset.uri.toLowerCase().match("jpg|jpeg|gif|png|webp") !== null) {
          assetOutput = (<img src={asset.uri} className={asset.className} />);
        }
        // it's a video
        if (asset.uri.toLowerCase().match("mp4|webm|ogv") !== null) {
          // TODO: make it smart so it will create a video element with many sources instead of many video elements for different video formats
          assetOutput = (
            <video className={asset.className} >
              <source src={asset.uri} type={"video/" + asset.uri.toLowerCase().split('.').pop()} />
            </video>
          );
        }

        // adding props if any
        if (asset.attributes !== undefined) {
          Array.prototype.forEach.call(asset.attributes, function(a) {
            assetOutput.props[Object.keys(a)[0]] = a[Object.keys(a)[0]];
          });
        }

        output.push(assetOutput);
      });
    }

    return (<div className="wrapper">{output}</div>); 
  }
});
