export function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export function formatDate(input) {
    const monthMap = {
        'gennaio': '01',
        'febbraio': '02',
        'marzo': '03',
        'aprile': '04',
        'maggio': '05',
        'giugno': '06',
        'luglio': '07',
        'agosto': '08',
        'settembre': '09',
        'ottobre': '10',
        'novembre': '11',
        'dicembre': '12'
    };

    const regex = /(\d{1,2}) (\w+) (\d{4}) alle ore (\d{1,2}:\d{2})/;
    const match = input.match(regex);

    if (match) {
        const day = match[1];
        const monthName = match[2];
        const year = match[3];
        const time = match[4];

        const month = monthMap[monthName.toLowerCase()];
        return `${day}/${month}/${year} - ${time}`;
    } else {
        return "Data invalida";
    }
}
