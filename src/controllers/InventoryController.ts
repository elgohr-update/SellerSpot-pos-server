import { RequestHandler } from 'express';
import {
    IAddProductToInventoryRequest,
    IInventoryData,
    IGetAllInventoryProductResponse,
    IAddProductToInventoryResponse,
    STATUS_CODE,
    ISearchResourceQueryParam,
    ISearchInventoryProductsResponse,
    IGetOutletInventoryProductResponse,
    IGetProductInventoryProductResponse,
    IEditProductInInventoryRequest,
    IEditInventoryProductResponse,
} from '@sellerspot/universal-types';
import { InventoryService } from '../services/InventoryService';

export class InventoryController {
    static getOutletInventoryProducts: RequestHandler = async (req, res) => {
        const response: IGetOutletInventoryProductResponse = {
            status: true,
            data: await InventoryService.getOutletInventoryProducts(req.params.outletid),
        };
        res.status(STATUS_CODE.OK).send(response);
    };

    static getProductInventoryProducts: RequestHandler = async (req, res) => {
        const response: IGetProductInventoryProductResponse = {
            status: true,
            data: await InventoryService.getProductInventoryProducts(req.params.productid),
        };
        res.status(STATUS_CODE.OK).send(response);
    };

    static getAllInventoryProducts: RequestHandler = async (req, res) => {
        const response: IGetAllInventoryProductResponse = {
            status: true,
            data: await InventoryService.getAllInventoryProducts(),
        };
        res.status(STATUS_CODE.OK).send(response);
    };

    static searchInventoryProducts: RequestHandler = async (req, res) => {
        const params = req.query as unknown as ISearchResourceQueryParam;
        const matchedBrands: IInventoryData[] = await InventoryService.searchInventoryProducts(
            params.query,
            req.params.outletid,
        );
        res.status(STATUS_CODE.OK).send(<ISearchInventoryProductsResponse>{
            status: true,
            data: matchedBrands,
        });
    };

    static addProductToInventory: RequestHandler = async (req, res) => {
        const response: IInventoryData[] = await InventoryService.addProductToInventory(
            <IAddProductToInventoryRequest>req.body,
        );
        res.status(STATUS_CODE.CREATED).send(<IAddProductToInventoryResponse>{
            status: true,
            data: response,
        });
    };

    static editProductInInventory: RequestHandler = async (req, res) => {
        const response: IInventoryData = await InventoryService.editProductInInventory(
            <IEditProductInInventoryRequest>req.body,
        );
        res.status(STATUS_CODE.CREATED).send(<IEditInventoryProductResponse>{
            status: true,
            data: response,
        });
    };

    static deleteInventoryProduct: RequestHandler = async (req, res) => {
        await InventoryService.deleteInventoryProduct(req.params.productid, req.params.outletid);
        res.status(STATUS_CODE.NO_CONTENT).send();
    };
}