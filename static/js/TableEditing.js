// Inspired and helped by "The Codeholic" youtube channel.
// class that helps edit cells
class TableCellEditing {
    constructor(table) {
      this.tbody = table.querySelector("tbody");
    }
  
    init() {
      this.tds = this.tbody.querySelectorAll("td");
      this.tds.forEach((td) => {
        if (td.getAttribute("contenteditable")) {
          td.setAttribute("contenteditable", false);
        } else {
          td.setAttribute("contenteditable", true);
        }
  
        if (td.querySelector("button")) {
          td.setAttribute("contenteditable", false);
        }
  
        if (!td.querySelector("button")) {
          td.addEventListener("click", (ev) => {
            if (!this.inEditing(td)) {
              this.startEditing(td);
            }
          });
        }
      });
    }
  
    startEditing(td) {
      const activeTd = this.findEditing();
      if (activeTd) {
        this.cancelEditing(activeTd);
      }
  
      td.className = "in-editing";
      td.setAttribute("data-old-value", td.innerHTML);
      this.createButtonToolbar(td);
    }
  
    cancelEditing(td) {
      td.innerHTML = td.getAttribute("data-old-value");
      td.classList.remove("in-editing");
    }
  
    finishEditing(td) {
      td.classList.remove("in-editing");
      const data = {};
  
      let elm = td.parentElement.children;
      let id = elm[0].getAttribute("data-entry-id");
      let name = elm[0].innerHTML;
      let link = elm[1].querySelector("a").innerHTML;
      let username = elm[2].querySelector("p").innerText;
      let hash;
      //If password was not changed
      if (elm[3].querySelector(".is-hidden")) {
        console.log("not changed");
        hash = elm[3].querySelector(".is-hidden").innerHTML;
      }
      //If password was changed
      else {
        hash = crypt.encrypt(elm[3].querySelector("#password2").innerHTML);
      }
  
      let keys = ["id", "name", "link", "username", "hash"];
      let values = [id, name, link, username, hash];
  
      for (let i = 0; i < keys.length; i++) {
        data[keys[i]] = values[i];
      }
  
      const response = makeRequests(data);
      console.log(response);
  
      this.removeToolbar(td);
    }
  
    inEditing(td) {
      return td.classList.contains("in-editing");
    }
  
    createButtonToolbar(td) {
      const toolbar = document.createElement("div");
      toolbar.className = "button-toolbar";
      toolbar.setAttribute("contenteditable", false);
  
      toolbar.innerHTML = `
      <div class="button-wrapper">
      <button class="btn-save">Save</button>
      </div>
      `;
  
      td.appendChild(toolbar);
  
      const btnSave = toolbar.querySelector(".btn-save");
  
      btnSave.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.finishEditing(td);
      });
    }
  
    removeToolbar(td) {
      const toolbar = td.querySelector(".button-toolbar");
      toolbar.remove();
    }
  
    findEditing() {
      return Array.prototype.find.call(this.tds, (td) => this.inEditing(td));
    }
  }
  