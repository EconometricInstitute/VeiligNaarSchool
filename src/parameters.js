const PREFIX = 'Groep ' ;
const NUMBER_OF_YEARS = 8;
const GROUP_TYPES = [...Array(NUMBER_OF_YEARS).keys()].map(i => ({short: ''+(i+1), full: PREFIX+(i+1)}));

export {PREFIX, NUMBER_OF_YEARS, GROUP_TYPES};