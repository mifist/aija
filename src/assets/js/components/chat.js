(function ($) {
  "use_strict";
  
  const getUrlVars = () => {
    let vars = {};
    window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        vars[key] = value;
      }
    );
    if (window.location.hash) {
      const hash = window.location.hash.replace("#", "/#");
      hash.replace(/[#&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
      });
    }
    return vars;
  };

  const url_vars = getUrlVars();

  $(window).on("load ready resize orientationChange", function () {

    const chatSection = $(document).find(".chat-section");
    if (chatSection && chatSection?.length > 0) { 

      if ($(window).width() <= 861) {
        chatSection.find(".chat-sidebar").removeClass("hide");
        chatSection.find(".chat-main").removeClass("hide").addClass("hide");
      } else {
        chatSection.find(".chat-sidebar").removeClass("hide");
        chatSection.find(".chat-main").removeClass("hide");
      }

      if (url_vars?.chat_action) {
        const chatSection = $(document).find(".chat-section");
        if (chatSection && chatSection.length > 0) {
          // set active side menu item based on location href
          chatSection.find(`.chat-main__body`).each(function () {
            if (url_vars?.chat_action == $(this).attr("id")) {
              $(this).removeClass("hide");
              if ($(window).width() <= 861) {
                chatSection.find(".chat-sidebar").removeClass("hide");
                chatSection
                  .find(".chat-main")
                  .removeClass("hide")
                  .addClass("hide");
              } else {
                chatSection.find(".chat-sidebar").removeClass("hide");
                chatSection.find(".chat-main").removeClass("hide");
              }
            } else {
              $(this).addClass("hide");
            }
          });
        }
      }

    }
    
  });

  $(document).ready(function () {
    // console.log({ url_vars });

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
          // this.bindMessageTextArea();
        },
        get: function (selector, root = document) {
          return root.querySelector(selector);
        },
        cacheDOM: function () {

          if ($(window).width() <= 861) {
            chatSection.find(".chat-sidebar").removeClass("hide");
            chatSection.find(".chat-main").removeClass("hide").addClass("hide");
          } else {
            chatSection.find(".chat-sidebar").removeClass("hide");
            chatSection.find(".chat-main").removeClass("hide");
          }

          this.$chatForm = chatSection.find('form[name="chat-form"]');
          this.$chatBody = this.$chatForm.parents(".chat-main__body");
          this.$textarea = this.$chatBody.find('[name="chat-message"]');
          this.$chatHistoryList = this.$chatBody.find("ul.chat-list");
        },
        bindEvents: function () {
          this.$chatForm.each(this.submitBindAll.bind(this));
          this.$chatForm.on("keydown", this.submitForm.bind(this));

          chatSection
            .find(".chat-new-message")
            .on("click", this.handleOpenChatBody.bind(this));
          chatSection
            .find(".chat-sidebar__list .chat-list-item a")
            .on("click", this.handleOpenChatBody.bind(this));
          chatSection
            .find(".chat-serach__list .chat-list-item a")
            .on("click", this.handleOpenChatBody.bind(this));
          chatSection
            .find(".chat-sidebar-toggle")
            .on("click", this.toggleSidebar.bind(this));
        },
        submitBindAll: function (inx, elem) {
          const form = $(elem);
          form.on("submit", this.formSubmitHandler.bind(this));
        },
        submitForm: function (event) {
          if (window.event.keyCode == "13") {
            this.$chatForm.submit();
          }
        },
        formSubmitHandler: function (event) {
          event.preventDefault();
          const currentForm = $(event.currentTarget);
          const currentMsg = currentForm.find('[name="chat-message"]').val();

          this.$chatBody = currentForm.parents(".chat-main__body");
          this.$textarea = currentForm.find('[name="chat-message"]');
          this.$chatHistoryList = currentForm
            .parents(".chat-main__body")
            .find("ul.chat-list");

          if (currentMsg && currentMsg.trim() !== "") {
            this.removeEmptyMsg();
            this.appendMessage(currentMsg);
            this.botResponse();
          }
        },
        toggleSidebar: function (event) {
          const currentEl = $(event.currentTarget);
          if (chatSection.find(".chat-sidebar").hasClass("hide")) {
            chatSection.find(".chat-sidebar").removeClass("hide");
            chatSection.find(".chat-main").removeClass("hide").addClass("hide");
          } else {
            chatSection.find(".chat-sidebar").removeClass("hide").addClass("hide");
            chatSection.find(".chat-main").removeClass("hide");
          }
        },
        appendMessage: function (message) {
          if (message && message.trim() !== "") {
            const msgHTML = this.msgTempleteSender(message);
            this.$chatHistoryList.append(msgHTML);
            this.$textarea.val("");
            this.scrollToBottom();
          }
        },
        appendMessageRecipient: function (message) {
          if (message && message.trim() !== "") {
            this.removeTypingMsg();
            const msgHTML = this.msgTempleteRecipient(message);
            this.$chatHistoryList.append(msgHTML);
            this.scrollToBottom();
          }
        },
        appendTypingMsg: function () {
          const typingMsg = this.msgTyping();
          this.$chatHistoryList.append(typingMsg);
          this.scrollToBottom();
        },
        appendEmptyMsg: function () {
          const typingMsg = this.msgEmpty();
          this.$chatHistoryList.append(typingMsg);
          this.scrollToBottom();
        },
        removeEmptyMsg: function () {
          this.$chatHistoryList.find(".chat-list-item.empty-item").remove();
        },
        removeTypingMsg: function () {
          this.$chatHistoryList.find(".chat-list-item.typing").remove();
        },
        botResponse: function () {
          const randomMsg = this.getRandomItem(this.messageResponses);
          if (randomMsg && randomMsg.toString().trim() !== "") {
            this.appendTypingMsg();

            const delay = randomMsg.split(" ").length * 100;
            setTimeout(() => {
              this.appendMessageRecipient(randomMsg);
            }, delay);
          }
        },
        bindMessageTextArea: function () {
          const div = document.querySelector(".chat-main__form-message");
          const ta = document.querySelector(".chat-message");

          ta.addEventListener("keydown", autosize);

          function autosize() {
            setTimeout(function () {
              ta.style.cssText = "height:0px";
              let height = Math.min(26 * 5, ta.scrollHeight);
              div.style.cssText = "height:" + height + "px";
              ta.style.cssText = "height:" + height + "px";
            }, 0);
          }
        },
        scrollToBottom: function () {
          this.$chatHistoryList &&
            this.$chatHistoryList.scrollTop(
              this.$chatHistoryList[0].scrollHeight
            );
        },
        getCurrentTime: function () {
          return new Date()
            .toLocaleTimeString()
            .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        },
        getRandomItem: function (arr) {
          return arr && arr[Math.floor(Math.random() * arr.length)];
        },
        msgTyping: function () {
          return `<li class="chat-list-item typing">
          <div class="message-item-chat typing">
            <div class="message-user">
              <div class="user-photo">
                <img src="assets/images/Avatar_2.png" alt="Wade Warren" />
              </div>
              <span class="user-status online"></span>
            </div>
            <div class="message-info">
              <div class="message-header">
                <div class="message-user-info">
                  <h6 class="user-name">Wade Warren</h6>
                </div>
              </div>
              <div class="message-text">
                <div class="dot-typing"></div>
              </div>
            </div>
          </div>
        </li>`;
        },
        msgEmpty: function () {
          return `<li class="chat-list-item empty-item">
          <div class="message-item-big empty-item">There are no messages in this conversation yet.</div>
        </li>`;
        },
        msgTempleteSender: function (message) {
          return `<li class="chat-list-item right">
          <div class="message-item-chat my-msg">
            <div class="message-info">
              <div class="message-header">
                <div class="message-user-info">
                  <h6 class="user-name">You</h6>
                </div>
                <div class="message-time">${this.getCurrentTime()}</div>
              </div>
              <div class="message-text">
                <p>${message}</p>
              </div>
            </div>
          </div>
        </li>`;
        },
        msgTempleteRecipient: function (message) {
          return `<li class="chat-list-item">
          <div class="message-item-chat">
            <div class="message-user">
              <div class="user-photo">
                <img src="assets/images/Avatar_2.png" alt="Wade Warren" />
              </div>
              <span class="user-status online"></span>
            </div>
            <div class="message-info">
              <div class="message-header">
                <div class="message-user-info">
                  <h6 class="user-name">Wade Warren</h6>
                </div>
                <div class="message-time">${this.getCurrentTime()}</div>
              </div>
              <div class="message-text">
                <p>${message}</p>
              </div>
            </div>
          </div>
        </li>`;
        },
        handleOpenChatBody: function (e) {
          let vars = {};
          const thisLink = $(e.currentTarget);
          if (thisLink.attr("href")) {
            const hash = thisLink.attr("href").replace("#", "/#");
            hash.replace(/[#&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
              vars[key] = value;
            });
          }
          if (vars?.chat_action) {
            chatSection.find(".chat-main__body").each(function (inx, item) {
              const currentBody = $(item);
              if (vars?.chat_action == currentBody.attr("id")) {
                currentBody.removeClass("hide");
                if ($(window).width() <= 861) {
                  chatSection.find(".chat-sidebar").removeClass("hide");
                  chatSection.find(".chat-main").removeClass("hide").addClass("hide");
                } else {
                  chatSection.find(".chat-sidebar").removeClass("hide");
                  chatSection.find(".chat-main").removeClass("hide");
                }
              } else {
                currentBody.addClass("hide");
              }
            });
          }
        },
      };

      chat.init();

      // Search user in the list
      const searchFilter = {
        root: function () {
          const userList = chatSection.find(".chat-sidebar__list");
          return userList;
        },
        rootNewMsg: function () {
          const userList = chatSection.find(".chat-serach__list");
          return userList;
        },
        options: { valueNames: ["user-name"] },
        resetList: function () {
          const root = this.root();
          const userList = root.find(".chat-sidebar__list");
          const userListItem = root.find("> li");

          // show all items if seraching vakue is empty
          userListItem.each(function (e) {
            $(this).removeClass("hide");
          });

          // remove empty message if we have it in the list
          if (
            userList.find(".chat-list-item.empty-item") &&
            userList.find(".chat-list-item.empty-item").length > 0
          ) {
            userList.find(".chat-list-item.empty-item").remove();
          }
        },
        findInList: function (value) {
          const root = this.root();
          const userListItem = root.find("> li");
          if (value) {
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
                  root.append(noItems);
                } else {
                  // remove empty message if we have it in the list
                  if (
                    root.find(".chat-list-item.empty-item") &&
                    root.find(".chat-list-item.empty-item").length > 0
                  ) {
                    root.find(".chat-list-item.empty-item").remove();
                  }
                }
              } else {
                user.removeClass("hide");
              }
            });
          } else {
            this.resetList();
          }
        },
        resetListNewMsg: function () {
          const root = this.rootNewMsg();
          const userList = root.find(".chat-sidebar__list");
          const userListItem = root.find("> li");

          // show all items if seraching vakue is empty
          userListItem.each(function (e) {
            $(this).removeClass("hide");
          });

          // remove empty message if we have it in the list
          if (
            userList.find(".chat-list-item.empty-item") &&
            userList.find(".chat-list-item.empty-item").length > 0
          ) {
            userList.find(".chat-list-item.empty-item").remove();
          }
        },
        findInListNewMsg: function (value) {
          const root = this.rootNewMsg();
          const userListItem = root.find("li");

          if (value) {
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
                  root.append(noItems);
                } else {
                  // remove empty message if we have it in the list
                  if (
                    root.find(".chat-list-item.empty-item") &&
                    root.find(".chat-list-item.empty-item").length > 0
                  ) {
                    root.find(".chat-list-item.empty-item").remove();
                  }
                }
              } else {
                user.removeClass("hide");
              }
            });
          } else {
            this.resetListNewMsg();
          }
        },
        init: function () {
          const userList = this.root();
          const searchInput = chatSection.find(
            '.chat-sidebar__header [type="search"]'
          );
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
              searchInput.on("search", (_event) => {
                const targetValue = _event.currentTarget?.value,
                  serachValue = targetValue.toString().toLowerCase();
                this.findInList(serachValue);
              });
            }
          }
        },
        initSearchNewMsg: function () {
          const userList = this.rootNewMsg();
          const searchInput = chatSection.find(
            '.chat-main__messages [type="search"]'
          );
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
                this.findInListNewMsg(serachValue);
              });
              searchInput.on("search", (_event) => {
                const targetValue = _event.currentTarget?.value,
                  serachValue = targetValue.toString().toLowerCase();
                this.findInListNewMsg(serachValue);
              });
            }
          }
        },
      };

      searchFilter.init();
      searchFilter.initSearchNewMsg();
    }
  });
})(jQuery);
