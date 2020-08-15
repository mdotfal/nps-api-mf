'use strict';

const apiKey = "api_key=DVigDbZPUbu77czZW3aUhUQ6eTm3S28oAMEvTSTW";
const searchURL = "https://developer.nps.gov/api/v1/parks";

function formatQueryParams( params ) {
  // declare a variable to convert params object into an array of keys
  const queryItems = Object.keys( params )
  // loop through keys and values
    .map( key => `${encodeURIComponent( key )}=${encodeURIComponent( params[ key] )}` )
  // join query at &
  return queryItems.join( '&' );
}

function displayResults( responseJson ) {
  console.log( responseJson );
  // loop through responseJson.data array length
  for ( let i = 0; i < responseJson.data.length; i++ ) {
    // append list items to <ul>
    $( '#results-list' ).append(
      ` <hr>
        <li>
          <h3>${responseJson.data[i].fullName}</h3>
          <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>
          <p><b>State:</b> ${responseJson.data[i].states}</p>
          <p><b>Directions:</b> ${responseJson.data[i].directionsInfo}</p>
          <p><b>Description:</b> ${responseJson.data[i].description}</p>
        </li>
      `
    )};
    //  remove hidden class
  $( '#results' ).removeClass( 'hidden' );
}

function getNationalParks( query, maxResults ) {
  // declare params object
  const params = {
    stateCode: query,
    limit: maxResults
  };

  // declare queryString to access variables for url
  const queryString = formatQueryParams( params );
  const url =  `${searchURL}?${queryString}&${apiKey}`;

  fetch( url )
    .then( response => {
      if ( response.ok ) {
        return response.json();
      }
      $( '#results-list' ).empty();
      throw new Error( 'State not Found.' );
    })
    .then( responseJson => {
      $( '#results-list' ).empty();
      displayResults( responseJson, maxResults );
      $( '.error-message' ).empty();
    })
    .catch( error => {
      $( '#js-error-message' ).text( `Something went wrong:  ${error.message}` );
      $( '#results-list' ).empty();
    });
}

function watchForm() {
  // listen on form submit
  $( 'form' ).submit( event => {
    console.log('running watchForm')
    event.preventDefault();
    const searchTerm = $( '#js-search-term' ).val();
    const maxResults = $( '#js-max-results' ).val();
    // call getNationalParks
    getNationalParks( searchTerm, maxResults );
  });
}

$( watchForm );