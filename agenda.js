(function(){
    /** User interface */
    const ui = {
      // Estou pegando todos os campos que são da tag input
      fields: document.querySelectorAll("input"),
      // Estou pegando todos os botões que possuem a classe do CSS .pure-button
      button: document.querySelector(".pure-button"),
      // Estou varregendo Window e pegando a tag tbody que é a nossa table
      table: document.querySelector("tbody")
    };

    /** Modelo Contact */
    let contact = {
      name: "",
      email: "",
      fone: ""
    };

    /**
     * Método responsável pela validação de todos os campos da tela, validação se está vazio.
     * @param {*} e 
     */
     const validateFields = function (e){
       let erros = 0;
       let contgetContactsact = {};
       // Previne rodar o evento default do botão dentro do formulário que é submeter a informação e dar reload da tela.
       e.preventDefault();

      //  console.log(e.target); (Consegue pegar aonde o evento foi disparado pelo usuário)

       ui.fields.forEach(
         function (field, pos, campos) {
           if(field.value.trim().length > 0){
             contact[field.id] = field.value;
             field.classList.remove("error");
          } else {
            erros += 1;
            field.classList.add("error");
          }
        }
       );

       if(erros === 0){
         addContact(contact);
       } else {
         document.querySelector(".error").focus();
       }
     };

     /**
      * Função que faz a limpeza de todos os campos da tela
      */
     const cleanFields = function(){
       // Usando arrow function
       ui.fields.forEach(field => field.value = "");
     };

     /** REST API (GET, POST, PUT/PATCH, DELETE)*/
     /**
      * Função para adicionar um novo contato
      */
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

      /** Executa o processo de comunicação POST utilizando FETCH ECS 6 */
       fetch(endPoint, config)
        .then(addContactSuccess)
        .catch(messagePostError);
     };

     /**
      * Função após sucesso de inserir um novo contato, faz a limpeza da tela e atualiza a lista de contatos
      */
      const addContactSuccess = function(){
        cleanFields();
        getContacts();
      };

      /**
       * Função responsável por montar o HTML da nossa table, precisa receber uma lista de contatos
       * @param {*} contacts 
       */
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
       };

       /**
        * Função reponsável por efetuar o GET no servidor pegandos todos os contatos
        */
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
       .catch(messageGetError);
      };

      /**
       * Função responsável por verificar o evento do usuário e se for o evento do botão "delete" pega o ID e faz um DELETE
       * @param {*} e 
       */
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
          .catch(messageDeleteError);
        }
      };

     /**
      * Funções de mensagens de status para o desenvolvimento
      */
      const messagePostSucess = function(){
        console.log("POST - Realizado com sucesso");
      };
      const messagePostError = function(){
        console.error("Erro durante o POST");
      };
      const messageGetSucess = function(){
        console.log("GET - Realizado com sucesso");
      };
      const messageGetError = function(){
        console.error("Erro durante o GET");
      };
      const messageDeleteSucess = function(){
        console.log("DELETE - Realizado com sucesso");
      };
      const messageDeleteError = function(){
        console.error("Erro durante o DELETE");
      };

      /**
       * Função de start-up da página, só roda uma única vez
       */
     const init = function(){
       // Mapeando os eventos da aplicação
      //  ui.button.onmouseover = function() {
      //    alert("sobre");
      //  }
      // Adiciono um evento em todos os botões, com a chamada para validar os campos
      ui.button.addEventListener("click", validateFields);
      // Adiciono um evento na tabela, e chamo a função de remover contato onde é filtrado se o evento foi realmente do nosso link de remover
      ui.table.addEventListener("click", removeContact);
      // Faço o carregamento inicial dos contatos
      getContacts();
     }();

})();
