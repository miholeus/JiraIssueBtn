const JiraIssueButton = {
  buttonId: "JiraCopyIssueBtn",

  jiraHost: function() {
    return `https://${window.location.host}`;
  },

  copyToClipboard: function(data) {
    navigator.clipboard.writeText(
      `${this.jiraHost()}/${data["key"]} ${data["fields"]["summary"]}`
    );
  },

  copyToClickboardId: function(data) {
    navigator.clipboard.writeText(data["key"]);
  },

  attachTo: function(container) {
    const self = this;
    const btnText = "Copy";
    let div = document.createElement('div');
    div.className = 'aui-buttons pluggable-ops';
    let btn = document.createElement("a");
    btn.textContent = btnText;
    btn.id = self.buttonId;
    btn.className = "aui-button";
    div.appendChild(btn);
    container.appendChild(div);
  
    let issueEndpoint = `${self.jiraHost()}/rest/api/2/issue/`;
  
    btn.onclick = function () {
      fetch(`${issueEndpoint}${self.issueId()}`)
        .then((response) => response.json())
        .then((data) => self.copyToClipboard(data)
        );
  
      btn.textContent = "copied!";
      setTimeout(
        function () {
          btn.textContent = btnText;
        }.bind(self),
        2000
      );
    };
  
    btn.ondblclick = function () {
      fetch(`${issueEndpoint}${self.issueId()}`)
        .then((response) => response.json())
        .then((data) => self.copyToClickboardId(data));
  
      btn.textContent = "id copied!";
      setTimeout(
        function () {
          btn.textContent = btnText;
        }.bind(self),
        2000
      );
    };
  },

  issueId: function() {
    const searchIssue = "selectedIssue=";
    if (document.URL.includes(searchIssue)) {
      const match = document.URL.match(/\&selectedIssue=(.*?)(\&|$)/)[1];
      return match.replaceAll("&", "").replace("selectedIssue=");
    } else {
      const match = document.title.match(/\[(.*?)\]/)[1];
      return match.replaceAll("[", "").replaceAll("]", "");
    }
  }
}

const observer = new MutationObserver(function (mutationList, ob) {
  const container =
    document.querySelector(".ops-menus .aui-toolbar2-primary") ??
    document.querySelector(".ghx-detail-head .ghx-key-group");

  if (container) {
    if (!document.getElementById("JiraCopyIssueBtn")) {
      JiraIssueButton.attachTo(container);
    }
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
});
