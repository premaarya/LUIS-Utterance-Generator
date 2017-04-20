function luisJSONGenerator(inputData, entities)
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

        if(utt.indexOf(key) > -1){
          entityLabel = {};
          entityLabel["entityName"] = key.toString().substring(1, key.toString().length - 1);
          entityLabel["startCharIndex"] = utt.indexOf(key);
          entityLabel["endCharIndex"] = entityLabel["startCharIndex"] + value.length - 1;
          entityLabels.push(entityLabel);
        }
      })

      block["text"] = newLine;
      block["intentName"] = key.toString();
      block["entityLabels"] = entityLabels;

      if(newLine != "")
        LUISBody.push(block);
    })
  })

  return LUISBody;
}
