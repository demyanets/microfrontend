/**
 * Meta router broadcast metadata
 */
export class MessageBroadcastMetadata {
    constructor(readonly tag: string, readonly source: string, readonly recipients?: string[]) {}
}
