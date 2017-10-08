(function(){
    /** User interface */
    const ui = {
      fields: document.querySelectorAll("input"),
      button: document.querySelector(".pure-button"),
      table: document.querySelector("tbody")
    };
    /** Modelo Contact */
    let contact = {
      name: "",
      email: "",
      fone: ""
    };

    // Validação dos campos de forma dinâmica
     const validateFields = function (e){
       let erros = 0;
       let contgetContactsact = {};
       // Previne rodar o evento default do botão dentro do formulário que é submeter a informação e dar reload da tela.
       e.preventDefault();

      //  console.log(e.target);
      //  console.log(ui.fields[0].value);

       ui.fields.forEach(
         function (field, pos, campos) {
           if(field.value.trim().length > 0){
             contact[field.id] = field.value;
             field.classList.remove("error");
            //  console.log(campo.value.trim().length);
          } else {
            erros += 1;
            field.classList.add("error");
          }
          //  console.log(field.id ,field.value.trim().length);
          //  console.log(contact, erros);
        }
       );

       if(erros === 0){
         addContact(contact);
       } else {getContacts
         document.querySelector(".error").focus();
       }
     };

     const cleanFields = function(){
       // Usando arrow function
       ui.fields.forEach(field => field.value = "");
     }

     const addContactSuccess = function(){
       cleanFields();
       getContacts();
     }
     // Usando arrow function
     const addContactError = () => console.error("Erro durante a gravação");

     /** REST API (GET, POST, PUT/PATCH, DELETE)*/
     const addContact = function (contact){
       const endPoint = "http://localhost:1234/contacts";
       // Header , tipo um contrato determinando o que vamos receber e enviar
       const headers = new Headers();
       headers.append("Content-type", "application/json");

       const config = {
         method: "POST",
         body: JSON.stringify(contact),
         headers: headers
       };
      //  console.log(config);

      /** Executa o processo de comunicação POST utilizando FETCH */
       fetch(endPoint, config)
        .then(addContactSuccess)
        //.catch(addContactError);
     };

     const getContactsSucess = function(contacts){
       let html = [];
       let linha;

       if(contacts.length === 0){
        linha = `<tr>
           <td colspan="5">Não existem dados registrados!</td>
         </tr>`
         html.push(linha);
         } else {
           //console.table(contacts);
            contacts.forEach(function (contact){
              linha = `<tr>
                  <td>${contact.id}</td>
                  <td>${contact.name}</td>
                  <td>${contact.email}</td>
                  <td>${contact.fone}</td>
                  <td><a href="#" data-action="delete" data-id="${contact.id}">Excluir</a>
                  <a href="#" data-action="update" data-id="${contact.id}">Atualizar</a></td>
              </tr>`;
              html.push(linha);
            })
         }
        ui.table.innerHTML = html.join("");
       }

     const getContacts = function (){
       const endPoint = "http://localhost:1234/contacts";
       // Header , tipo um contrato determinando o que vamos receber e enviar
       const headers = new Headers();
       headers.append("Content-type", "application/json");

       const config = {
         method: "GET",
         headers: headers
       };

      /** Executa o processo de comunicação GET utilizando FETCH */
       fetch(endPoint, config)
       .then(response => response.json())
       .then(getContactsSucess)
       .catch(addContactError);
      };

      const removeContact = function (e){
        e.preventDefault();
        if(e.target.dataset.action === 'delete'){

          let context = e.target.dataset;

          const endPoint = `http://localhost:1234/contacts/${context.id}`;
          // Header , tipo um contrato determinando o que vamos receber e enviar
          const headers = new Headers();
          headers.append("Content-type", "application/json");

          const config = {
            method: "DELETE",
            headers: headers
          };

         /** Executa o processo de comunicação GET utilizando FETCH */
          fetch(endPoint, config)
          .then(getContacts)
          .catch(addContactError);
        }
      };

     const init = function(){
       // Mapeando os eventos da aplicação
      //  ui.button.onmouseover = function() {
      //    alert("sobre");
      //  }
      ui.button.addEventListener("click", validateFields);
      ui.table.addEventListener("click", removeContact);
      getContacts();
     }();

    //  console.log("Modelo: ", contact);
     //sconsole.log(ui);
     //console.log("Lista dos Modelos: ", listContacts());
})();
