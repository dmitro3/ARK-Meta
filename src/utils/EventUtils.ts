import MathUtils from "./MathUtils";

export default class EventUtils {

    private static eventArr = new Array();

    public static onEvent(node, type: string, event: Function): void {
        var eventInfo = new EventInfo(node, type, event);

        this.eventArr.push(eventInfo);
    }

    public static dispatchEvent(type, data): void {
        for (var i = 0; i < this.eventArr.length; i++) {
            var event: EventInfo = this.eventArr[i];

            if (event.type == type) {
                event.envent.call(event.envent, data);
            }
        }
    }

    public static offAllEventByNode(node): void {
        var tempEventArr = new Array();

        for (var i = 0; i < this.eventArr.length; i++) {
            var event = this.eventArr[i];

            if (event.name != node._tempUUID) {
                tempEventArr.push(event);
            }
        }

        this.eventArr = tempEventArr;
    }
}

class EventInfo {
    public name: string;
    public envent: Function;
    public type: string;

    constructor(node, type: string, event: Function) {
        if (!node._tempUUID) {
            node._tempUUID = MathUtils.generateUUID();
        }
        this.name = node._tempUUID;
        this.envent = event;
        this.type = type;
    }
}