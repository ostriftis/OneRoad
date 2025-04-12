const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv'); // For CSV conversion
const {
    getTollStationPasses,
    getPassAnalysis,
    getPassesCost,
    getChargesBy
} = require('../db/mySqlFuncs'); 
const { authenticate, authorize } = require('../login/authMiddleware');

// POST for validation and redirection
router.post('/api/validate-time', (req, res) => {
    const { start, end, tollId, tagOpID ,type} = req.body;
    const format = req.body.format || 'json';

    if (!start || !end || !tollId || !type ) {
        return res.redirect('/failedGetRawData.html');
    }

    if (new Date(start) > new Date(end)) {
        return res.redirect('/failedGetRawData.html');
    }

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`;
    };

    const formattedStart = formatDate(start);
    const formattedEnd = formatDate(end);
    if(type === 'tollStationPasses'){
     return res.redirect(`/api/${type}/${tollId}/${formattedStart}/${formattedEnd}?format=${format}`);
    }
    else
    {
        return res.redirect(`/api/${type}/${tollId}/${tagOpID}/${formattedStart}/${formattedEnd}?format=${format}`);
    }
});

// GET for fetching data and rendering pages

router.get('/api/:type/:tollId/:tagOpID?/:start/:end', async (req, res) => {
    const { type, tollId, start, end, tagOpID } = req.params;
    const {format} = req.query;
    const validTypes = ['tollStationPasses', 'passAnalysis', 'passesCost', 'chargesBy'];
    const validFormats = ['json', 'csv'];
    if (!format && type === 'passAnalysis') {
        return res.redirect(`/api/${type}/${tollId}/${tagOpID}/${start}/${end}?format=json`);
    }
    if (!format && type === 'passesCost') {
        return res.redirect(`/api/${type}/${tollId}/${tagOpID}/${start}/${end}?format=json`);
    }
    if (!format && type ==='tollStationPasses') {
        return res.redirect(`/api/${type}/${tollId}/${start}/${end}?format=json`);
    }
    if (!format && type ==='chargesBy') {
        return res.redirect(`/api/${type}/${tollId}/${start}/${end}?format=json`);
    }

    console.log(`Requested format: ${format}`);

    if (type === 'passAnalysis' && !tagOpID) {
        return res.status(400).send('tagOpID is required for passAnalysis');
    }
    if (!validTypes.includes(type)) {
        return res.status(404).send('Page not found');
    }

    try {
        let data;
        let formattedData;

        switch (type) {
            case 'tollStationPasses':
                data = await getTollStationPasses(tollId, start, end);
                formattedData = {
                    stationID: tollId,
                    stationOperator: data.length > 0 ? data[0].stationOperator : null,
                    requestTimestamp: new Date().toISOString(),
                    periodFrom: start,
                    periodTo: end,
                    nPasses: data.length,
                    passList: data.map((pass, index) => ({
                        passIndex: index + 1,
                        passID: pass.passID,
                        timestamp: pass.timestamp,
                        tagID: pass.tagID,
                        tagProvider: pass.tagProvider,
                        passType: pass.tagProvider === pass.stationOperator ? 'home' : 'visitor',
                        passCharge: pass.passCharge,
                    })),
                };
                break;

            case 'passAnalysis':
                data = await getPassAnalysis(tagOpID, tollId, start, end);
                formattedData = {
                    stationOpID: tollId,
                    tagOpID: tagOpID,
                    requestTimestamp: new Date().toISOString(),
                    periodFrom: start,
                    periodTo: end,
                    nPasses: data.length,
                    passList: data.map((pass, index) => ({
                        passIndex: index + 1,
                        passID: pass.passID,       // Ensure `tagID` exists in your query result
                        stationID: pass.stationID, // Ensure this matches the SQL alias 'stationID'
                        timestamp: pass.timestamp,
                        tagID: pass.tagID,
                        passCharge: parseFloat(pass.passCharge), // Ensure correct float conversion
                    })),
                };
                break;

            case 'passesCost':
                data = await getPassesCost(tollId, tagOpID, start, end);
                formattedData = {
                    tollOpID: tollId,
                    tagOpID: tagOpID,
                    requestTimestamp: new Date().toISOString(),
                    periodFrom: start,
                    periodTo: end,
                    nPasses: data.length > 0 ? data[0].nPasses : 0,
                    passesCost: data.length > 0 ? parseFloat(data[0].passesCost) : 0.0,
                };
                break;

            case 'chargesBy':
                data = await getChargesBy(tollId, start, end);
                formattedData = {
                    tollOpID: tollId,
                    requestTimestamp: new Date().toISOString(),
                    periodFrom: start,
                    periodTo: end,
                    vOpList: data.map(entry => ({
                        visitingOpID: entry.visitingOpID,
                        nPasses: entry.nPasses,
                        passesCost: parseFloat(entry.passesCost),
                    })),
                };
                break;
                
        }

        if (format === 'json') {
            res
            .setHeader('Content-Type', 'application/json');
            
            return res.json(formattedData);
        } else if (format === 'csv') {
            if (data.length === 0) {
                return res.send('No data available');
            }
        
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        
            const { Parser } = require('json2csv');
        
            try {
        
                let flatData = [];
        
                switch (type) {
                    case 'tollStationPasses':
                        flatData = data.map((pass, index) => ({
                            stationID: tollId,
                            stationOperator: pass.stationOperator,
                            requestTimestamp: new Date().toISOString(),
                            periodFrom: start,
                            periodTo: end,
                            nPasses: data.length,
                            passIndex: index + 1,
                            passID: pass.passID,
                            timestamp: pass.timestamp,
                            tagID: pass.tagID,
                            tagProvider: pass.tagProvider,
                            passType: pass.tagProvider === pass.stationOperator ? 'home' : 'visitor',
                            passCharge: pass.passCharge,
                        }));
                        break;
        
                    case 'passAnalysis':
                        flatData = data.map((pass, index) => ({
                            stationOpID: tollId,
                            tagOpID: tagOpID,
                            requestTimestamp: new Date().toISOString(),
                            periodFrom: start,
                            periodTo: end,
                            nPasses: data.length,
                            passIndex: index + 1,
                            passID: pass.passID,
                            stationID: pass.stationID,
                            timestamp: pass.timestamp,
                            tagID: pass.tagID,
                            passCharge: parseFloat(pass.passCharge),
                        }));
                        break;
        
                    case 'passesCost':
                        flatData = [
                            {
                                tollOpID: tollId,
                                tagOpID: tagOpID,
                                requestTimestamp: new Date().toISOString(),
                                periodFrom: start,
                                periodTo: end,
                                nPasses: data.length > 0 ? data[0].nPasses : 0,
                                passesCost: data.length > 0 ? parseFloat(data[0].passesCost) : 0.0,
                            }
                        ];
                        break;

                    case 'chargesBy':
                        flatData = data.map(entry => ({
                            tollOpID: tollId,
                            requestTimestamp: new Date().toISOString(),
                            periodFrom: start,
                            periodTo: end,
                            visitingOpID: entry.visitingOpID,
                            nPasses: entry.nPasses,
                            passesCost: parseFloat(entry.passesCost),
                        }));
                        break;
                        
                        
        
                    default:
                        return res.status(400).send('Invalid type specified for CSV export');
                }
        
                const parser = new Parser({ delimiter: ',' });
                const csv = parser.parse(flatData);
        
                return res.send(csv);
            } catch (error) {
                console.error('Error converting JSON to CSV:', error.message);
                return res.status(500).send('Error converting data to CSV format');
            }
        }
        
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Error fetching data from the database.');
    }
});


router.post('/api/debts', authenticate, async (req, res) => {
    try {

        const {tollOpID, start, end, format} = req.body;

        if (!tollOpID || !start || !end || !format ) {
            console.log('to1: tollOpID=%s start=%s end=%s type=%s', tollOpID, start, end, format);
            return res.redirect('/failedGetRawData.html');
        }

        if (new Date(start) > new Date(end)) {
            console.log('to2');
            return res.redirect('/failedGetRawData.html');
        }


        const rawDebts = {};
        const data = await getChargesBy(tollOpID, start, end);
        formattedData = {
            tollOpID: tollOpID,
            requestTimestamp: new Date().toISOString(),
            periodFrom: start,
            periodTo: end,
            vOpList: data.map(entry => ({
                visitingOpID: entry.visitingOpID,
                nPasses: entry.nPasses,
                passesCost: parseFloat(entry.passesCost),
            }))
        };
        rawDebts[tollOpID] = formattedData.vOpList.reduce((acc, entry) => {
            acc[entry.visitingOpID] = entry.passesCost;
            return acc;
        }, {});

        const reverseDebts = {};
        for (const entry of formattedData.vOpList) {
            const reverseData = await getChargesBy(entry.visitingOpID, start, end);
            formattedReverseData = {
                tollOpID: tollOpID,
                requestTimestamp: new Date().toISOString(),
                periodFrom: start,
                periodTo: end,
                vOpList: reverseData.map(entry => ({
                    visitingOpID: entry.visitingOpID,
                    nPasses: entry.nPasses,
                    passesCost: parseFloat(entry.passesCost),
                }))
            };
            reverseDebts[entry.visitingOpID] = formattedReverseData.vOpList.reduce((acc, reverseEntry) => {
                if (reverseEntry.visitingOpID === tollOpID) {
                    acc = reverseEntry.passesCost;
                }
                return acc;
            }, 0);
        }

        const netDebts = {};
        for (const [to, amount] of Object.entries(rawDebts[tollOpID])) {
            const reverseAmount = reverseDebts[to] || 0;
            const netAmount = amount - reverseAmount;

            if (netAmount > 0) {
                netDebts[to] = netAmount.toFixed(2);
            }
        }

        formattedData = {
            period: { start, end },
            netDebts,
        };

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            return res.json(formattedData);
        } else if (format === 'csv') {
            if (data.length === 0) {
                return res.send('No data available');
            }
        
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        
            const { Parser } = require('json2csv');

            try {
                const flatData = Object.entries(formattedData.netDebts).map(([operator, amount]) => ({
                    operatorID: operator,
                    netDebt: amount,
                    startDate: formattedData.period.start,
                    endDate: formattedData.period.end,
                }));
            
                const parser = new Parser({ delimiter: ',' });
                const csv = parser.parse(flatData);
        
                return res.send(csv);
            } catch (error) {
                console.error('Error converting JSON to CSV:', error.message);
                return res.status(500).send('Error converting data to CSV format');
            }
        }

    } catch (error) {
        console.error('Error fetching net debts:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;




