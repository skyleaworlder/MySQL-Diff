
export class CheckConstraint {
    constraint_name: String;
    constraint_conditions: String;

    constructor(
        constraint_name: String,
        constraint_conditions: String
    ) {
        this.constraint_name = constraint_name;
        this.constraint_conditions = constraint_conditions;
    }
}