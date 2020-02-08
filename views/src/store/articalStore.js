let myStore = {
    debug : true,
    state: {
        articalData: null
    },
    setArticalDataAction(newValue) {
        if (this.debug) console.log("setMsgAction trigged with ", newValue);
        this.state.articalData = newValue;
    },
    clearArticalDataAction() {
        if (this.debug) console.log("clearMsgAction trigged");
        this.state.articalData = null;
    }
}

export default myStore;