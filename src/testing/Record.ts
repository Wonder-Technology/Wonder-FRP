module dyRt {
    var defaultIsEqual = function (a, b) {
        return a === b;
    };

    export class Record{
        private _time:number = null;
        get time(){
            return this._time;
        }
        set time(time:number){
            this._time = time;
        }

        private _value:number = null;
        get value(){
            return this._value;
        }
        set value(value:number){
            this._value = value;
        }

        private _comparer:Function = null;

        /**
         * Creates a new object recording the production of the specified value at the given virtual time.
         *
         * @constructor
         * @param {Number} time Virtual time the value was produced on.
         * @param {Mixed} value Value that was produced.
         * @param {Function} comparer An optional comparer.
         */
        constructor(time, value, comparer?) {
            this._time = time;
            this._value = value;
            this._comparer = comparer || defaultIsEqual;
        }

        /**
         * Checks whether the given recorded object is equal to the current instance.
         *
         * @param {Recorded} other Recorded object to check for equality.
         * @returns {Boolean} true if both objects are equal; false otherwise.
         */
        equals(other) {
            return this._time === other.time && this._comparer(this._value, other.value);
        }

        //    /**
        //     * Returns a string representation of the current Recorded value.
        //     *
        //     * @returns {String} String representation of the current Recorded value.
        //     */
        //    toString () {
        //    return this.value.toString() + '@' + this.time;
        //}
    }
}