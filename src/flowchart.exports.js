// Export the flowchart object for **CommonJS**. 
// If we're not in CommonJS, add `flowchart` to the
// global object or to jquery.
if (typeof module !== 'undefined' && module.exports) {
   module.exports = flowchart;
} else {  
  root.flowchart = root.flowchart || flowchart;
}