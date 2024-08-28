const statusMessage = document.querySelector("#status-message")

function showStatus(message, isSuccessful) {
    statusMessage.innerText = message

    if (isSuccessful) {
      statusMessage.classList.add('success')
    } else {
      statusMessage.classList.add('fail')
    }

    statusMessage.classList.remove('hidden')

    setTimeout(() => {
      statusMessage.classList.add('hidden')
      statusMessage.classList.remove('fail')
      statusMessage.classList.remove('success')
    }, "5000")
  }

  export {
    showStatus
  }