'use strict';

const apiKey = "api_key=DVigDbZPUbu77czZW3aUhUQ6eTm3S28oAMEvTSTW";
const searchURL = "https://developer.nps.gov/api/v1/parks";

function formatQueryParams( params ) {
  const queryItems = Object.keys( params )
    .map( key => `${encodeURIComponent( key )}=${encodeURIComponent( params[ key] )}` )
  return queryItems.join( '&' );
}

function displayResults( responseJson ) {
  console.log( responseJson.data );
  for ( let i = 0; i < responseJson.data.length; i++ ) {
    $( '#results-list' ).append(
      ` <li>
          <h3><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
          <p>${responseJson.data[i].addresses[i].line3}</p>
          <p>${responseJson.data[i].addresses[i].stateCode}, ${responseJson.data[i].addresses[i].postalCode} </p>
          <p>${responseJson.data[i].description}</p>
        </li>
      `
    )};
  $( '#results' ).removeClass( 'hidden' );
}

function getNationalParks( query, maxResults ) {
  const params = {
    stateCode: query,
    limit: maxResults
  };

  console.log(params);
  const queryString = formatQueryParams( params );
  const url =  `${searchURL}?${queryString}&${apiKey}`;
  console.log(url);

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
  $( 'form' ).submit( event => {
    console.log('running watchForm')
    event.preventDefault();
    const searchTerm = $( '#js-search-term' ).val();
    const maxResults = $( '#js-max-results' ).val();
    getNationalParks( searchTerm, maxResults);
  });
}

$( watchForm );