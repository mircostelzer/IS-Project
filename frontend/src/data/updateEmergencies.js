const apiEmergencies = import.meta.env.VITE_API_BASE_URL + "/emergencies/"

// Aggiorna emergencies_index con i dati presi da apiEmergencies
function updateAlgoliaRecords() {
    // Mi collego all'API di Algolia
    const algolia = algoliasearch(import.meta.env.VITE_ALGOLIA_APP_ID, import.meta.env.VITE_ALGOLIA_WRITE_KEY);

    const processRecords = async () => {
        // Svuoto prima emergencies_index
        const response = await algolia.clearObjects({ indexName: 'emergencies_index' });

        // Recupero poi le emergenze aggiornata dalla chiamata API
        const datasetRequest = await fetch(apiEmergencies);
        const emergenciesRecord = await datasetRequest.json();

        // Inserisco infine le emergenze ottenuto in emergencies_index
        return await algolia.saveObjects({ indexName: 'emergencies_index', objects: emergenciesRecord });
    };

    processRecords()
        .then(() => console.log('Algolia: emergencies successfully updated and indexed'))
        .catch((err) => console.error(err));
}