define([], function () {
    function warn(text, extraClass){
        var alertDiv = document.createElement('div');
        alertDiv.className = 'alert fade in '+extraClass;
        var closeButton = document.createElement('button');
        closeButton.type="button";
        closeButton.className = "close";
        closeButton.setAttribute('data-dismiss', "alert");
        closeButton.innerHTML = "&times;";
        var message = document.createElement('span');
        message.innerHTML = text;
        
        alertDiv.appendChild(closeButton);
        alertDiv.appendChild(message);
        
        $('#alerts').append(alertDiv);
        return alertDiv;
    }
    return warn;
});