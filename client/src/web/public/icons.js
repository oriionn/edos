class Circle extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
            <svg
                viewBox="0 0 470 474"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M90 108H379V474H90V108Z" />
                <path d="M0 380V93H108V380H0Z" />
                <path d="M362 380V93H470V380H362Z" />
                <path d="M379 108H92V0L379 0V108Z" />
            </svg>
        `;
    }
}

class Key extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
            <svg
                viewBox="0 0 888 888"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M0 751H205V888H0V751Z" fill="white" />
                <path d="M69 683H342V751H69V683Z" fill="white" />
                <path d="M137 615H410V683H137V615Z" fill="white" />
                <path d="M205 547H478V615H205V547Z" fill="white" />
                <path d="M273 479H751V547H273V479Z" fill="white" />
                <path d="M341 411H819V479H341V411Z" fill="white" />
                <path d="M342 205H888V411H342V205Z" fill="white" />
                <path d="M342 137H615V205H342V137Z" fill="white" />
                <path d="M410 69H819V137H410V69Z" fill="white" />
                <path d="M751 137H888V205H751V137Z" fill="white" />
                <path d="M478 0H751V69H478V0Z" fill="white" />
                <path d="M273 751H205V819H273V751Z" fill="white" />
            </svg>
        `;
    }
}

class X extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
            <svg
                viewBox="0 0 324 324"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M0 283H41V324H0V283Z" fill="white" />
                <path d="M41 242H82V283H41V242Z" fill="white" />
                <path d="M82 201H123V242H82V201Z" fill="white" />
                <path d="M201 82H242V123H201V82Z" fill="white" />
                <path d="M242 41H283V82H242V41Z" fill="white" />
                <path d="M283 0H324V41H283V0Z" fill="white" />
                <path d="M82 82H123V123H82V82Z" fill="white" />
                <path d="M41 41H82V82H41V41Z" fill="white" />
                <path d="M0 0H41V41H0V0Z" fill="white" />
                <path d="M201 201H242V242H201V201Z" fill="white" />
                <path d="M242 242H283V283H242V242Z" fill="white" />
                <path d="M283 283H324V324H283V283Z" fill="white" />
                <path d="M123 123H201V201H123V123Z" fill="white" />
            </svg>
        `;
    }
}

class Copy extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
            <svg
                viewBox="0 0 477 476"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M152 195H196V432H152V195Z" fill="#FFFFFF" />
                <path d="M0 44H44V281H0V44Z" fill="#FFFFFF" />
                <path d="M174 432H196V454H174V432Z" fill="#FFFFFF" />
                <path d="M22 281H44V303H22V281Z" fill="#FFFFFF" />
                <path d="M22 22H44V44H22V22Z" fill="#FFFFFF" />
                <path d="M433 432H455V454H433V432Z" fill="#FFFFFF" />
                <path d="M433 173H455V195H433V173Z" fill="#FFFFFF" />
                <path d="M174 173H196V195H174V173Z" fill="#FFFFFF" />
                <path d="M281 22H303V44H281V22Z" fill="#FFFFFF" />
                <path d="M433 195H477V432H433V195Z" fill="#FFFFFF" />
                <path d="M196 195V151H433V195H196Z" fill="#FFFFFF" />
                <path d="M44 44V0H281V44H44Z" fill="#FFFFFF" />
                <path d="M196 476V432H433V476H196Z" fill="#FFFFFF" />
                <path d="M44 325V281H108V325H44Z" fill="#FFFFFF" />
                <path d="M281 44H325V108H281V44Z" fill="#FFFFFF" />
            </svg>
        `;
    }
}

class ArrowLeft extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <svg viewBox="0 0 22 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 9H6V10H4V9Z" fill="white"/>
                <path d="M3 8H6V9H3V8Z" fill="white"/>
                <path d="M2 7H5V8H2V7Z" fill="white"/>
                <path d="M1 6H4V7H1V6Z" fill="white"/>
                <path d="M1 3H4V4H1V3Z" fill="white"/>
                <path d="M2 2H5V3H2V2Z" fill="white"/>
                <path d="M3 1H6V2H3V1Z" fill="white"/>
                <path d="M4 0H6V1H4V0Z" fill="white"/>
                <path d="M0 4H22V6H0V4Z" fill="white"/>
            </svg>
        `;
    }
}

customElements.define("circle-icon", Circle);
customElements.define("key-icon", Key);
customElements.define("x-icon", X);
customElements.define("copy-icon", Copy);
customElements.define("arrowleft-icon", ArrowLeft);
