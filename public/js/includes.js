function includeHTML() {
  return new Promise((resolve, reject) => {

      let arrayIncludeNode = document.querySelectorAll("*[w3-include-html]")
      let countNode = arrayIncludeNode.length

      arrayIncludeNode.forEach((item, index) => {
        let link = item.getAttribute("w3-include-html")

        fetch(link, {
          method: "GET"
        })
        .then((response) => {
          if(response.ok)
          {
            response.text()
            .then((datas) =>
            {
              console.log(datas.substring(0,10))
              item.innerHTML = datas
              item.removeAttribute("w3-include-html")

              //resolve ici  --> ok ok c'est dégueu LOL
              if(index == countNode-1)
                resolve()
            })
          }
        })
        .catch((e) => {
          item.innerHTML = "Page not found."
        })
      })

  })
  
}

export default includeHTML