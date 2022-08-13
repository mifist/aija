(function ($) {
  "use_strict";

  // TODO: be more elegant here
  function format(text) {
    return text
      .replace(/ /g, "")
      .replace(/(<([^>]+)>)/gi, "")
      .toLowerCase();
  }

  $(document).ready(function () {
    const chatSection = $(document).find(".chat-section");
    if (chatSection && chatSection?.length > 0) {
      const chat = {
        messageToSend: "",
        messageResponses: [
          "Why did the web developer leave the restaurant? Because of the table layout.",
          "How do you comfort a JavaScript bug? You console it.",
          'An SQL query enters a bar, approaches two tables and asks: "May I join you?"',
          "What is the most used language in programming? Profanity.",
          "What is the object-oriented way to become wealthy? Inheritance.",
          "An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol",
        ],
        init: function () {
          this.cacheDOM();
          this.bindEvents();
          this.render();
        },
        cacheDOM: function () {
          this.$chatHistory = $(".chat-history");
          this.$button = $("button");
          this.$textarea = $("#message-to-send");
          this.$chatHistoryList = this.$chatHistory.find("ul");
        },
        bindEvents: function () {
          this.$button.on("click", this.addMessage.bind(this));
          this.$textarea.on("keyup", this.addMessageEnter.bind(this));
        },
        render: function () {
          this.scrollToBottom();
          /*    if (this.messageToSend.trim() !== '') {
            let template = Handlebars.compile( $("#message-template").html());
            let context = { 
              messageOutput: this.messageToSend,
              time: this.getCurrentTime()
            };
    
            this.$chatHistoryList.append(template(context));
            this.scrollToBottom();
            this.$textarea.val('');
            
            // responses
            let templateResponse = Handlebars.compile( $("#message-response-template").html());
            let contextResponse = { 
              response: this.getRandomItem(this.messageResponses),
              time: this.getCurrentTime()
            };
            
            setTimeout(function() {
              this.$chatHistoryList.append(templateResponse(contextResponse));
              this.scrollToBottom();
            }.bind(this), 1500);
            
          } */
        },

        addMessage: function () {
          this.messageToSend = this.$textarea.val();
          this.render();
        },
        addMessageEnter: function (event) {
          // enter was pressed
          if (event.keyCode === 13) {
            this.addMessage();
          }
        },
        scrollToBottom: function () {
          console.log(this.$chatHistory);
          /*  this.$chatHistory &&
            this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight); */
        },
        getCurrentTime: function () {
          return new Date()
            .toLocaleTimeString()
            .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        },
        getRandomItem: function (arr) {
          return arr[Math.floor(Math.random() * arr.length)];
        },
      };

      chat.init();

      // Search user in the list
      const searchFilter = {
        options: { valueNames: ["user-name"] },
        findInList: function (value) {
          const userListItem = chatSection.find(".chat-sidebar__list > li");
          if (value) {
            const userList = chatSection.find(".chat-sidebar__list");
            const noItems =
              '<li class="chat-list-item empty-item"><div class="message-item-big empty-item">No items found</div></li>';
            const totalLength = userListItem?.length;
            let hiddenItem = 0;
            userListItem.each(function (e) {
              const user = $(this),
                userName = user.find(".user-name").text(),
                compareUserName = userName.toString().toLocaleLowerCase();
              if (compareUserName.indexOf(value) == -1) {
                ++hiddenItem;
                user.addClass("hide");
              
                // add empty message if total list item amount the same as hidden item amount
                if (totalLength == hiddenItem) {
                  userList.append(noItems);
                } else {
                  // remove empty message if we have it in the list
                  if (
                    userList.find(".chat-list-item.empty-item") &&
                    userList.find(".chat-list-item.empty-item").length > 0
                  ) {
                    userList.find(".chat-list-item.empty-item").remove();
                  }
                }

              } else {
                user.removeClass("hide");
              }
            });
          } else {
            // show all items if seraching vakue is empty
            userListItem.each(function (e) {
              $(this).removeClass("hide");
            });
          }
        },
        init: function () {
          const searchInput = chatSection.find('[type="search"]');
          const userList = chatSection.find(".chat-sidebar__list");
          const noItems =
            '<li class="chat-list-item empty-item"><div class="message-item-big empty-item">No items found</div></li>';
        
          if (
            searchInput &&
            searchInput?.length > 0 &&
            userList &&
            userList?.length > 0
          ) {
            const userListNode = userList[0];
            // empty message if in list item is 0 or empty string
            if (
              userListNode?.childNodes?.length <= 0 ||
              (userListNode?.childNodes?.length == 1 &&
                userListNode?.childNodes[0].nodeName == "#text")
            ) {
              userList.html(noItems);
            } else {
              searchInput.on("keyup", (_event) => {
                const targetValue = _event.currentTarget?.value,
                  serachValue = targetValue.toString().toLowerCase();
                this.findInList(serachValue);
              });
            }

          }
        },
      };

      searchFilter.init();
    }
  });
})(jQuery);
