var fs = require('fs');

fs.createReadStream('imagem.jpg')
  .pipe(fs.createWriteStream('imagem-com-stream.jpg'))
  .on('finish', function(err){
    if (err){
      console.log(error);
    }else{
      console.log('arquivo escrito com stream');
    }
  });
