function checkUserData() {
    const userData = getCookie("userData")
    console.log(userData)
    if (userData) {
        $("#signInButton").hide()
        $("#signOutButton").show()
        document.getElementById('userName').innerText = userData.name
        if (userData.type === 'admin') {
            $("#adminNavigation").show()
        }
    } else {
        document.getElementById('userName').innerText = ""
        $("#signInButton").show()
        $("#signOutButton").hide()
    }

    const stocks = getCookie("stocks") || []
    // document.getElementById('shoppingCardNumber').innerText = stocks.length 
    document.getElementById('shoppingCardNumber').innerText = stocks.reduce((sum, stock) => sum + stock.amount, 0)
}

function adminGuard() {
    const userData = getCookie("userData")
    console.log('Admin Guard', userData)
    if (!userData || userData.type !== 'admin') {
        location.href = '/'
    }
}

function signOut() {
    deleteCookie("userData")
    deleteCookie("stocks")
    checkUserData()
    location.href = '/'
}

function goToStockDetail(id) {
    console.log(id)
    location.href = `/stocks?id=${id}`
}

function roundPrice(price) {
    return Math.round(price * 100) / 100
}

checkUserData()