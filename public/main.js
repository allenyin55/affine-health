const input = document.getElementById("search_bar")
const btn = document.getElementById("search_btn")

// This function does 2 things:
// 1. Take the input value and send to the server to search
// if there's a match entry in the given csv file.
// 2. On receiving the response from the server, if a match is
// found, get the geocode of the address. Otherwise, alert user the physician not found
function search(){
  let name = input.value.split(" ")

  // The physician can either have or doesn't have a middle name
  if(name.length < 3){
    first = name[0]
    middle = ""
    last = name[1]
  }
  else{
    first = name[0]
    middle = name[1]
    last = name[2]
  }

  // sedn the post request to the server with the name of the physician
  axios.post('/entries', {
    firstName: first,
    middleName: middle,
    lastName: last
  })
  .then(function (response) {
    // if a match is found, send the physican's address to goolge's geocoding service
    // to get it's geocode. Update the marker based on the geocode.
    axios.get('https://maps.googleapis.com/maps/api/geocode/json?address='+response.data[6])
    .then((res) => { 
      moveMarker(marker, res.data.results[0].geometry.location)
    })
    .catch((err) => {
      alert(err)
    })
  })
  // No match found. Alert the user.
  .catch(function (error) {
    if (error.response) {
      alert(error.response.data.message);
    }
  })
}

// This function move the marker based on the geocode.
function moveMarker(marker, newLatlng) {
  map.setCenter(newLatlng);
  marker.setPosition(newLatlng);
}

// The search funciton can be triggered by clicking
// the button or press enter.
btn.addEventListener("click", search)
input.addEventListener('keydown', function (e) {
  if(e.keyCode==13) {
    search();
  }
});