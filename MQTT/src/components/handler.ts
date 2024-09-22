import type { Request, ResponseToolkit } from "@hapi/hapi";
import ComponentsService from "./service";
import autoBind from "auto-bind";

class ComponentsHandler {
    private readonly _componentsService: ComponentsService;

    constructor(componentsService: ComponentsService) {
        this._componentsService = componentsService;
        autoBind(this);
    }

    async getUserTopicsByComponent(request: Request, h: ResponseToolkit) {
        const apiKey = request.headers.authorization;
        const { projectName, itemName } = request.params;
        const topics = await this._componentsService.getUserTopicsByComponent(
            apiKey,
            projectName,
            itemName
        );
        return h
            .response({
                status: "success",
                message: "User topics by component successfully retrieved.",
                data: {
                    topic_id: topics,
                },
            })
            .code(200);
    }
}

export default ComponentsHandler;
