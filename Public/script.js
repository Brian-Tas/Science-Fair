const fetchData = async path => {
    try {
        const response = await fetch(path);
        if(!response.ok) {
            throw new Error('GILBERT HAS VANISHED');
        }

        const data = await response.json();
        console.log(data);
    } catch(error) {
        console.error('gilbert has disapeered :(', error)
    }
}

const getGilbert = async () => {
    const data = await fetchData('./Brain/gilbert.json')
    if(data) {
        console.log(data);
    }
}

getGilbert();