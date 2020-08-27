const fs = require ('fs');
try {
  updateTextureFiles ();
  updateIndexHTML ();
} catch (err) {
  console.log ('build postprocessing failed with an error: ' + err);
}

function updateTextureFiles () {
  const textureString = fs.readFileSync (
    './www/assets/textures/goldenmaster.json',
    'utf8'
  );
  const texturesJSon = JSON.parse (textureString);
  const images = texturesJSon.images;
  images.forEach ((image, index) => {
    imageName = image.split ('.');
    if (imageName.length != 2) {
      console.log ('image name is not formatted properly');
    }
    const newImageName =
      imageName[0] + '-' + process.env.NAMESPACE + '.' + imageName[1];
    texturesJSon.images[index] = newImageName;
    fs.renameSync ('./www/' + image, './www/' + newImageName);
  });
  fs.writeFileSync (
    './www/assets/textures/goldenmaster.json',
    JSON.stringify (texturesJSon)
  );
}

function updateIndexHTML () {
  var cheerio = require ('cheerio'),
    $ = cheerio.load (fs.readFileSync ('./www/index.html'));
  $ ('script').each (function () {
    var id = $ (this).attr ('id');
    if (id == 'app_script') {
      var src = $ (this).attr ('src');
      var scriptSRC = src.split ('.', 2);
      if (scriptSRC.length != 2) {
        console.log ('html script source is not formatted properly');
      }
      var new_src =
        scriptSRC[0] + '_' + process.env.NAMESPACE + '.' + scriptSRC[1];
      $ (this).attr ('src', new_src);
    }
  });
  $ ('link').each (function () {
    var id = $ (this).attr ('id');
    if (id == 'app_style') {
      var href = $ (this).attr ('href');
      var styleHREF = href.split ('.', 2);
      if (styleHREF.length != 2) {
        console.log ('html style href is not formatted properly');
      }
      var new_href =
        styleHREF[0] + '_' + process.env.NAMESPACE + '.' + styleHREF[1];
      $ (this).attr ('href', new_href);
    }
  });
  fs.writeFileSync ('./www/index.html', $.html ());
}
