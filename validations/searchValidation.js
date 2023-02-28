import handleServerErrors from "../utils/handleServerErrors.js";

export default (req, res, next) => {
    try {
        const {title, minPrice, maxPrice, minWeight, maxWeight, minHeight, maxHeight, page} = req.query;
        if (!title) delete req.query.title;
        if (isNaN(minPrice)) delete req.query.minPrice;
        if (isNaN(maxPrice)) delete req.query.maxPrice;
        if (isNaN(minWeight)) delete req.query.minWeight;
        if (isNaN(maxWeight)) delete req.query.maxWeight;
        if (isNaN(minHeight)) delete req.query.minHeight;
        if (isNaN(maxHeight)) delete req.query.maxHeight;
        if (isNaN(page)) delete req.query.page;

        next();
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};