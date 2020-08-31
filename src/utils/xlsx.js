const xlsxFile = window.require("read-excel-file/node");

class XLSX {
  path;
  pages = [];
  pagesName = [];

  constructor(path) {
    this.path = path;
  }

  async load() {
    const pageNames = (await xlsxFile(this.path, { getSheets: true })).map(
      (e) => e.name
    );
    this.pagesName = pageNames;
    for (let i = 0; i < pageNames.length; i++) {
      const pageData = await xlsxFile(this.path, { sheet: pageNames[i] });
      this.pages[i] = pageData;
    }
  }

  searchByReference(ref) {
    let result = [];
    // take always first page header for all spreadsheets
    result.push(this.pages[0][0]);
    for (let i = 0; i < this.pages.length; i++) {
      let search_in = this.pages[i].slice(1);
      search_in.forEach((element) => {
        if (element[0].startsWith(ref)) {
          result.push(element);
        }
      });
    }
    return result;
  }

  get sheetNames() {
    return this.pagesName;
  }
}

export default XLSX;
