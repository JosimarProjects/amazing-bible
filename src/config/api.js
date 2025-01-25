export const API_CONFIG = {
    BASE_URL: 'https://www.abibliadigital.com.br/api',
    BEARER_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJUaHUgTWF5IDMwIDIwMjQgMTM6NTc6MzcgR01UKzAwMDAuNjY1ODgzODBmZjA0MWUwMDI4OGEyMTIzIiwiaWF0IjoxNzE3MDc3NDU3fQ.dlAtkD62fcaN6-mgtIGF9_DqoLXliYgLlsd-tIbuTYc'
};

export const getApiHeaders = () => ({
    'Authorization': `Bearer ${API_CONFIG.BEARER_TOKEN}`
});
