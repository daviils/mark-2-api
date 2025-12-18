const excel = require('exceljs');

export const exportService = {
  async excel(name: string, data: any, worksheetColumns: any, res: any) {
    const workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet('sheet');

    worksheet.columns = worksheetColumns;

    // Add Array Rows
    worksheet.addRows(data);

    // res is a Stream object
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + `${name}.xlsx`,
    );

    const options = {
      dateFormat: 'DD/MM/YYYY HH:mm:ss',
      dateUTC: true, // use utc when rendering dates
    };

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  },
};
