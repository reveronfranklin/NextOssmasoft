export interface Value {
    code:        string;
    description: string;
}

export interface Item {
    field:  string;
    values: Value[];
}

export interface FixedParams {
    items: Item[];
}