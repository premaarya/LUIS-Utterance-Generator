function luisJSONGenerator(inputData, entities, version)
{
  var keys = Object.keys(inputData);
  var utterances = {};

  keys.forEach(function(key) {
    let json = {};
    json[key.toString()] = inputData[key];

    var values = intentUtteranceGenerator(json).split('\n')
    var utteranceClean = values.map(function(utt){
      return utt.replace(key.toString(), '').trim()
    });

    utterances[key.toString()] = utteranceClean;
  })

  var LUISBody = [];

  //LUIS GENERATOR
  keys.forEach(function(key){

    utterances[key.toString()].forEach(function(utt){
      var block = {};
      var newLine = utt;
      var entityLabels = [];

      entities.forEach((value, key) => {
        newLine = newLine.replace(key.toString(), value.toString());
      })

      entities.forEach((value, key) => {

        if(newLine.indexOf(value) > -1){
          entityLabel = {};

          switch(version){
            case "1" :
              entityLabel["entity"] = key.toString().substring(1, key.toString().length - 1);
              entityLabel["startPos"] = newLine.indexOf(value.toString());
              entityLabel["endPos"] = entityLabel["startPos"] + value.toString().length - 1;
            break;
            case "2" :
            entityLabel["entityName"] = key.toString().substring(1, key.toString().length - 1);
            entityLabel["startCharIndex"] = newLine.indexOf(value.toString());
            entityLabel["endCharIndex"] = entityLabel["startCharIndex"] + value.toString().length - 1;
            break;
          }
          entityLabels.push(entityLabel);
        }
      })

      switch(version){
        case "1" :
          block["intent"] = key.toString();
          block["entities"] = entityLabels;
        break;
        case "2" :
          block["intentName"] = key.toString();
          block["entityLabels"] = entityLabels;
        break;
      }

      block["text"] = newLine;
      console.log(newLine)

      if(newLine != "")
        LUISBody.push(block);
    })
  })

  return LUISBody;
}
