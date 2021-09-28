const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/";

fetch(url)
  .then((res) => res.json())
  .then((res) => {
    
    //Creación de variables.
    let setEvents = new Set();
    let cont = 0;

    // Obtención de los datos del JSON.
    let table = document.getElementById("table-data");
    res.forEach((element) => {
      bgcolor = "";
      if (element.squirrel) {
        bgcolor = 'bgcolor = "f9c6cb"';
      }
      let row = `<tr ${bgcolor}>
        <td>${(cont += 1)}</td>
        <td class="event">${element.events}</td>
        <td class="boolean">${element.squirrel}</td>
        </tr>`;
      table.innerHTML += row; //Se agregan los datos a la tabla.

      // Se obtiene los eventos únicos y se agregan al Set.
      values = element.events.toString().split(",");
      values.forEach((element) => setEvents.add(element));
    });

    // Se generan nuevamente las variables.
    setEvents = Array.from(setEvents);
    cont=0;
    
    // Obtención de la correlación por evento.
    let tuplas = {};
    setEvents.forEach((event) => {
      let [TP, TN, FP, FN] = [0, 0, 0, 0];      

      res.forEach((element) => {
        values = element.events.toString().split(",");
        if(values.includes(event) && element.squirrel) {TP++}
        if(!values.includes(event) && element.squirrel) {FP++}
        if(values.includes(event) && !element.squirrel) {FN++}
        if(!values.includes(event) && !element.squirrel) {TN++}      
      });

      let correlation = ((TP*TN)-(FP*FN))/(Math.sqrt((TP+FP)*(TP+FN)*(TN+FP)*(TN+FN)));
      tuplas[event] = correlation; // Se agrega la tupla de evento-correlación a un diccionario.
    });

    // Ordenar las tuplas de eventos y correlación.
    let items = Object.keys(tuplas).map(function(key) {
        return [key, tuplas[key]];
    });  
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    tuplas = items;
    
    // Se genera la segunda tabla.
    for (const [key, value] of Object.entries(tuplas)) {
        let table = document.getElementById("table-correlation");
        let row = `<tr>
                   <td>${(cont += 1)}</td>
                   <td class="event">${value[0]}</td>
                   <td class="correlation">${value[1]}</td>
                   </tr>`;
        table.innerHTML += row; //Se agregan los datos de evento y correlación a la tabla.
    };
  });