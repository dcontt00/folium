export default interface IServiceResult {
    success: boolean;
    status: number;
    data?: any; // Optional data field to hold any additional information
}