(()=>{

'use strict';



const isInstanceOf = (value, className) => {
  const C = globalThis[className];
  return C != null && value instanceof C;
}
const getTransferables = (value) => {
  if (value != null) {
  if (
    isInstanceOf(value, "ArrayBuffer") ||
    isInstanceOf(value, "MessagePort") ||
    isInstanceOf(value, "ImageBitmap") ||
    isInstanceOf(value, "OffscreenCanvas")
  ) {
    return [value];
  }
  if (typeof value === "object") {
    if (value.constructor === Object) {
    value = Object.values(value);
    }
    if (Array.isArray(value)) {
    return value.flatMap(getTransferables);
    }
    return getTransferables(value.buffer);
  }
  }
  return [];
};
const exports = {};
const workerMsgId = 'stencil.metrichor-jmespath.worker';
const workerMsgCallbackId = workerMsgId + '.cb';
addEventListener('message', async ({data}) => {
  if (data && data[0] === workerMsgId) {
  let id = data[1];
  let method = data[2];
  let args = data[3];
  let i = 0;
  let argsLen = args.length;
  let value;
  let err;

  try {
    for (; i < argsLen; i++) {
    if (Array.isArray(args[i]) && args[i][0] === workerMsgCallbackId) {
      const callbackId = args[i][1];
      args[i] = (...cbArgs) => {
      postMessage(
        [workerMsgCallbackId, callbackId, cbArgs]
      );
      };
    }
    }
    
    value = exports[method](...args);
    if (!value || !value.then) {
    throw new Error('The exported method "' + method + '" does not return a Promise, make sure it is an "async" function');
    }
    value = await value;
    

  } catch (e) {
    value = null;
    if (e instanceof Error) {
    err = {
      isError: true,
      value: {
      message: e.message,
      name: e.name,
      stack: e.stack,
      }
    };
    } else {
    err = {
      isError: false,
      value: e
    };
    }
    value = undefined;
  }

  const transferables = getTransferables(value);
  if (transferables.length > 0) console.debug('Transfering', transferables);

  postMessage(
    [workerMsgId, id, value, err],
    transferables
  );
  }
});


const isObject = (obj) => {
    return obj !== null && Object.prototype.toString.call(obj) === '[object Object]';
};
const strictDeepEqual = (first, second) => {
    if (first === second) {
        return true;
    }
    if (typeof first !== typeof second) {
        return false;
    }
    if (Array.isArray(first) && Array.isArray(second)) {
        if (first.length !== second.length) {
            return false;
        }
        for (let i = 0; i < first.length; i += 1) {
            if (!strictDeepEqual(first[i], second[i])) {
                return false;
            }
        }
        return true;
    }
    if (isObject(first) && isObject(second)) {
        const firstEntries = Object.entries(first);
        const secondKeys = new Set(Object.keys(second));
        if (firstEntries.length !== secondKeys.size) {
            return false;
        }
        for (const [key, value] of firstEntries) {
            if (!strictDeepEqual(value, second[key])) {
                return false;
            }
            secondKeys.delete(key);
        }
        return secondKeys.size === 0;
    }
    return false;
};
const isFalse = (obj) => {
    if (obj === '' || obj === false || obj === null || obj === undefined) {
        return true;
    }
    if (Array.isArray(obj) && obj.length === 0) {
        return true;
    }
    if (isObject(obj)) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
    return false;
};
const isAlpha = (ch) => {
    // tslint:disable-next-line: strict-comparisons
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_';
};
const isNum = (ch) => {
    // tslint:disable-next-line: strict-comparisons
    return (ch >= '0' && ch <= '9') || ch === '-';
};
const isAlphaNum = (ch) => {
    // tslint:disable-next-line: strict-comparisons
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch === '_';
};

var Token;
(function (Token) {
    Token["TOK_EOF"] = "EOF";
    Token["TOK_UNQUOTEDIDENTIFIER"] = "UnquotedIdentifier";
    Token["TOK_QUOTEDIDENTIFIER"] = "QuotedIdentifier";
    Token["TOK_RBRACKET"] = "Rbracket";
    Token["TOK_RPAREN"] = "Rparen";
    Token["TOK_COMMA"] = "Comma";
    Token["TOK_COLON"] = "Colon";
    Token["TOK_RBRACE"] = "Rbrace";
    Token["TOK_NUMBER"] = "Number";
    Token["TOK_CURRENT"] = "Current";
    Token["TOK_ROOT"] = "Root";
    Token["TOK_EXPREF"] = "Expref";
    Token["TOK_PIPE"] = "Pipe";
    Token["TOK_OR"] = "Or";
    Token["TOK_AND"] = "And";
    Token["TOK_EQ"] = "EQ";
    Token["TOK_GT"] = "GT";
    Token["TOK_LT"] = "LT";
    Token["TOK_GTE"] = "GTE";
    Token["TOK_LTE"] = "LTE";
    Token["TOK_NE"] = "NE";
    Token["TOK_FLATTEN"] = "Flatten";
    Token["TOK_STAR"] = "Star";
    Token["TOK_FILTER"] = "Filter";
    Token["TOK_DOT"] = "Dot";
    Token["TOK_NOT"] = "Not";
    Token["TOK_LBRACE"] = "Lbrace";
    Token["TOK_LBRACKET"] = "Lbracket";
    Token["TOK_LPAREN"] = "Lparen";
    Token["TOK_LITERAL"] = "Literal";
})(Token || (Token = {}));
const basicTokens = {
    '(': Token.TOK_LPAREN,
    ')': Token.TOK_RPAREN,
    '*': Token.TOK_STAR,
    ',': Token.TOK_COMMA,
    '.': Token.TOK_DOT,
    ':': Token.TOK_COLON,
    '@': Token.TOK_CURRENT,
    ['$']: Token.TOK_ROOT,
    ']': Token.TOK_RBRACKET,
    '{': Token.TOK_LBRACE,
    '}': Token.TOK_RBRACE,
};
const operatorStartToken = {
    '!': true,
    '<': true,
    '=': true,
    '>': true,
};
const skipChars = {
    '\t': true,
    '\n': true,
    '\r': true,
    ' ': true,
};
class StreamLexer {
    constructor() {
        this._current = 0;
    }
    tokenize(stream) {
        const tokens = [];
        this._current = 0;
        let start;
        let identifier;
        let token;
        while (this._current < stream.length) {
            if (isAlpha(stream[this._current])) {
                start = this._current;
                identifier = this.consumeUnquotedIdentifier(stream);
                tokens.push({
                    start,
                    type: Token.TOK_UNQUOTEDIDENTIFIER,
                    value: identifier,
                });
            }
            else if (basicTokens[stream[this._current]] !== undefined) {
                tokens.push({
                    start: this._current,
                    type: basicTokens[stream[this._current]],
                    value: stream[this._current],
                });
                this._current += 1;
            }
            else if (isNum(stream[this._current])) {
                token = this.consumeNumber(stream);
                tokens.push(token);
            }
            else if (stream[this._current] === '[') {
                token = this.consumeLBracket(stream);
                tokens.push(token);
            }
            else if (stream[this._current] === '"') {
                start = this._current;
                identifier = this.consumeQuotedIdentifier(stream);
                tokens.push({
                    start,
                    type: Token.TOK_QUOTEDIDENTIFIER,
                    value: identifier,
                });
            }
            else if (stream[this._current] === `'`) {
                start = this._current;
                identifier = this.consumeRawStringLiteral(stream);
                tokens.push({
                    start,
                    type: Token.TOK_LITERAL,
                    value: identifier,
                });
            }
            else if (stream[this._current] === '`') {
                start = this._current;
                const literal = this.consumeLiteral(stream);
                tokens.push({
                    start,
                    type: Token.TOK_LITERAL,
                    value: literal,
                });
            }
            else if (operatorStartToken[stream[this._current]] !== undefined) {
                token = this.consumeOperator(stream);
                token && tokens.push(token);
            }
            else if (skipChars[stream[this._current]] !== undefined) {
                this._current += 1;
            }
            else if (stream[this._current] === '&') {
                start = this._current;
                this._current += 1;
                if (stream[this._current] === '&') {
                    this._current += 1;
                    tokens.push({ start, type: Token.TOK_AND, value: '&&' });
                }
                else {
                    tokens.push({ start, type: Token.TOK_EXPREF, value: '&' });
                }
            }
            else if (stream[this._current] === '|') {
                start = this._current;
                this._current += 1;
                if (stream[this._current] === '|') {
                    this._current += 1;
                    tokens.push({ start, type: Token.TOK_OR, value: '||' });
                }
                else {
                    tokens.push({ start, type: Token.TOK_PIPE, value: '|' });
                }
            }
            else {
                const error = new Error(`Unknown character: ${stream[this._current]}`);
                error.name = 'LexerError';
                throw error;
            }
        }
        return tokens;
    }
    consumeUnquotedIdentifier(stream) {
        const start = this._current;
        this._current += 1;
        while (this._current < stream.length && isAlphaNum(stream[this._current])) {
            this._current += 1;
        }
        return stream.slice(start, this._current);
    }
    consumeQuotedIdentifier(stream) {
        const start = this._current;
        this._current += 1;
        const maxLength = stream.length;
        while (stream[this._current] !== '"' && this._current < maxLength) {
            let current = this._current;
            if (stream[current] === '\\' && (stream[current + 1] === '\\' || stream[current + 1] === '"')) {
                current += 2;
            }
            else {
                current += 1;
            }
            this._current = current;
        }
        this._current += 1;
        return JSON.parse(stream.slice(start, this._current));
    }
    consumeRawStringLiteral(stream) {
        const start = this._current;
        this._current += 1;
        const maxLength = stream.length;
        while (stream[this._current] !== `'` && this._current < maxLength) {
            let current = this._current;
            if (stream[current] === '\\' && (stream[current + 1] === '\\' || stream[current + 1] === `'`)) {
                current += 2;
            }
            else {
                current += 1;
            }
            this._current = current;
        }
        this._current += 1;
        const literal = stream.slice(start + 1, this._current - 1);
        return literal.replace(`\\'`, `'`);
    }
    consumeNumber(stream) {
        const start = this._current;
        this._current += 1;
        const maxLength = stream.length;
        while (isNum(stream[this._current]) && this._current < maxLength) {
            this._current += 1;
        }
        const value = parseInt(stream.slice(start, this._current), 10);
        return { start, value, type: Token.TOK_NUMBER };
    }
    consumeLBracket(stream) {
        const start = this._current;
        this._current += 1;
        if (stream[this._current] === '?') {
            this._current += 1;
            return { start, type: Token.TOK_FILTER, value: '[?' };
        }
        if (stream[this._current] === ']') {
            this._current += 1;
            return { start, type: Token.TOK_FLATTEN, value: '[]' };
        }
        return { start, type: Token.TOK_LBRACKET, value: '[' };
    }
    consumeOperator(stream) {
        const start = this._current;
        const startingChar = stream[start];
        this._current += 1;
        if (startingChar === '!') {
            if (stream[this._current] === '=') {
                this._current += 1;
                return { start, type: Token.TOK_NE, value: '!=' };
            }
            return { start, type: Token.TOK_NOT, value: '!' };
        }
        if (startingChar === '<') {
            if (stream[this._current] === '=') {
                this._current += 1;
                return { start, type: Token.TOK_LTE, value: '<=' };
            }
            return { start, type: Token.TOK_LT, value: '<' };
        }
        if (startingChar === '>') {
            if (stream[this._current] === '=') {
                this._current += 1;
                return { start, type: Token.TOK_GTE, value: '>=' };
            }
            return { start, type: Token.TOK_GT, value: '>' };
        }
        if (startingChar === '=' && stream[this._current] === '=') {
            this._current += 1;
            return { start, type: Token.TOK_EQ, value: '==' };
        }
    }
    consumeLiteral(stream) {
        this._current += 1;
        const start = this._current;
        const maxLength = stream.length;
        while (stream[this._current] !== '`' && this._current < maxLength) {
            let current = this._current;
            if (stream[current] === '\\' && (stream[current + 1] === '\\' || stream[current + 1] === '`')) {
                current += 2;
            }
            else {
                current += 1;
            }
            this._current = current;
        }
        let literalString = stream.slice(start, this._current).trimLeft();
        literalString = literalString.replace('\\`', '`');
        const literal = this.looksLikeJSON(literalString)
            ? JSON.parse(literalString)
            : JSON.parse(`"${literalString}"`);
        this._current += 1;
        return literal;
    }
    looksLikeJSON(literalString) {
        const startingChars = '[{"';
        const jsonLiterals = ['true', 'false', 'null'];
        const numberLooking = '-0123456789';
        if (literalString === '') {
            return false;
        }
        if (startingChars.includes(literalString[0])) {
            return true;
        }
        if (jsonLiterals.includes(literalString)) {
            return true;
        }
        if (numberLooking.includes(literalString[0])) {
            try {
                JSON.parse(literalString);
                return true;
            }
            catch (ex) {
                return false;
            }
        }
        return false;
    }
}
const Lexer = new StreamLexer();

const bindingPower = {
    [Token.TOK_EOF]: 0,
    [Token.TOK_UNQUOTEDIDENTIFIER]: 0,
    [Token.TOK_QUOTEDIDENTIFIER]: 0,
    [Token.TOK_RBRACKET]: 0,
    [Token.TOK_RPAREN]: 0,
    [Token.TOK_COMMA]: 0,
    [Token.TOK_RBRACE]: 0,
    [Token.TOK_NUMBER]: 0,
    [Token.TOK_CURRENT]: 0,
    [Token.TOK_EXPREF]: 0,
    [Token.TOK_ROOT]: 0,
    [Token.TOK_PIPE]: 1,
    [Token.TOK_OR]: 2,
    [Token.TOK_AND]: 3,
    [Token.TOK_EQ]: 5,
    [Token.TOK_GT]: 5,
    [Token.TOK_LT]: 5,
    [Token.TOK_GTE]: 5,
    [Token.TOK_LTE]: 5,
    [Token.TOK_NE]: 5,
    [Token.TOK_FLATTEN]: 9,
    [Token.TOK_STAR]: 20,
    [Token.TOK_FILTER]: 21,
    [Token.TOK_DOT]: 40,
    [Token.TOK_NOT]: 45,
    [Token.TOK_LBRACE]: 50,
    [Token.TOK_LBRACKET]: 55,
    [Token.TOK_LPAREN]: 60,
};
class TokenParser {
    constructor() {
        this.index = 0;
        this.tokens = [];
    }
    parse(expression) {
        this.loadTokens(expression);
        this.index = 0;
        const ast = this.expression(0);
        if (this.lookahead(0) !== Token.TOK_EOF) {
            const token = this.lookaheadToken(0);
            this.errorToken(token, `Unexpected token type: ${token.type}, value: ${token.value}`);
        }
        return ast;
    }
    loadTokens(expression) {
        this.tokens = [...Lexer.tokenize(expression), { type: Token.TOK_EOF, value: '', start: expression.length }];
    }
    expression(rbp) {
        const leftToken = this.lookaheadToken(0);
        this.advance();
        let left = this.nud(leftToken);
        let currentTokenType = this.lookahead(0);
        while (rbp < bindingPower[currentTokenType]) {
            this.advance();
            left = this.led(currentTokenType, left);
            currentTokenType = this.lookahead(0);
        }
        return left;
    }
    lookahead(offset) {
        return this.tokens[this.index + offset].type;
    }
    lookaheadToken(offset) {
        return this.tokens[this.index + offset];
    }
    advance() {
        this.index += 1;
    }
    nud(token) {
        let left;
        let right;
        let expression;
        switch (token.type) {
            case Token.TOK_LITERAL:
                return { type: 'Literal', value: token.value };
            case Token.TOK_UNQUOTEDIDENTIFIER:
                return { type: 'Field', name: token.value };
            case Token.TOK_QUOTEDIDENTIFIER:
                const node = { type: 'Field', name: token.value };
                if (this.lookahead(0) === Token.TOK_LPAREN) {
                    throw new Error('Quoted identifier not allowed for function names.');
                }
                else {
                    return node;
                }
            case Token.TOK_NOT:
                right = this.expression(bindingPower.Not);
                return { type: 'NotExpression', children: [right] };
            case Token.TOK_STAR:
                left = { type: 'Identity' };
                right =
                    (this.lookahead(0) === Token.TOK_RBRACKET && { type: 'Identity' }) ||
                        this.parseProjectionRHS(bindingPower.Star);
                return { type: 'ValueProjection', children: [left, right] };
            case Token.TOK_FILTER:
                return this.led(token.type, { type: 'Identity' });
            case Token.TOK_LBRACE:
                return this.parseMultiselectHash();
            case Token.TOK_FLATTEN:
                left = { type: Token.TOK_FLATTEN, children: [{ type: 'Identity' }] };
                right = this.parseProjectionRHS(bindingPower.Flatten);
                return { type: 'Projection', children: [left, right] };
            case Token.TOK_LBRACKET:
                if (this.lookahead(0) === Token.TOK_NUMBER || this.lookahead(0) === Token.TOK_COLON) {
                    right = this.parseIndexExpression();
                    return this.projectIfSlice({ type: 'Identity' }, right);
                }
                if (this.lookahead(0) === Token.TOK_STAR && this.lookahead(1) === Token.TOK_RBRACKET) {
                    this.advance();
                    this.advance();
                    right = this.parseProjectionRHS(bindingPower.Star);
                    return {
                        children: [{ type: 'Identity' }, right],
                        type: 'Projection',
                    };
                }
                return this.parseMultiselectList();
            case Token.TOK_CURRENT:
                return { type: Token.TOK_CURRENT };
            case Token.TOK_ROOT:
                return { type: Token.TOK_ROOT };
            case Token.TOK_EXPREF:
                expression = this.expression(bindingPower.Expref);
                return { type: 'ExpressionReference', children: [expression] };
            case Token.TOK_LPAREN:
                const args = [];
                while (this.lookahead(0) !== Token.TOK_RPAREN) {
                    if (this.lookahead(0) === Token.TOK_CURRENT) {
                        expression = { type: Token.TOK_CURRENT };
                        this.advance();
                    }
                    else {
                        expression = this.expression(0);
                    }
                    args.push(expression);
                }
                this.match(Token.TOK_RPAREN);
                return args[0];
            default:
                this.errorToken(token);
        }
    }
    led(tokenName, left) {
        let right;
        switch (tokenName) {
            case Token.TOK_DOT:
                const rbp = bindingPower.Dot;
                if (this.lookahead(0) !== Token.TOK_STAR) {
                    right = this.parseDotRHS(rbp);
                    return { type: 'Subexpression', children: [left, right] };
                }
                this.advance();
                right = this.parseProjectionRHS(rbp);
                return { type: 'ValueProjection', children: [left, right] };
            case Token.TOK_PIPE:
                right = this.expression(bindingPower.Pipe);
                return { type: Token.TOK_PIPE, children: [left, right] };
            case Token.TOK_OR:
                right = this.expression(bindingPower.Or);
                return { type: 'OrExpression', children: [left, right] };
            case Token.TOK_AND:
                right = this.expression(bindingPower.And);
                return { type: 'AndExpression', children: [left, right] };
            case Token.TOK_LPAREN:
                const name = left.name;
                const args = [];
                let expression;
                while (this.lookahead(0) !== Token.TOK_RPAREN) {
                    if (this.lookahead(0) === Token.TOK_CURRENT) {
                        expression = { type: Token.TOK_CURRENT };
                        this.advance();
                    }
                    else {
                        expression = this.expression(0);
                    }
                    if (this.lookahead(0) === Token.TOK_COMMA) {
                        this.match(Token.TOK_COMMA);
                    }
                    args.push(expression);
                }
                this.match(Token.TOK_RPAREN);
                const node = { name, type: 'Function', children: args };
                return node;
            case Token.TOK_FILTER:
                const condition = this.expression(0);
                this.match(Token.TOK_RBRACKET);
                right =
                    (this.lookahead(0) === Token.TOK_FLATTEN && { type: 'Identity' }) ||
                        this.parseProjectionRHS(bindingPower.Filter);
                return { type: 'FilterProjection', children: [left, right, condition] };
            case Token.TOK_FLATTEN:
                const leftNode = { type: Token.TOK_FLATTEN, children: [left] };
                const rightNode = this.parseProjectionRHS(bindingPower.Flatten);
                return { type: 'Projection', children: [leftNode, rightNode] };
            case Token.TOK_EQ:
            case Token.TOK_NE:
            case Token.TOK_GT:
            case Token.TOK_GTE:
            case Token.TOK_LT:
            case Token.TOK_LTE:
                return this.parseComparator(left, tokenName);
            case Token.TOK_LBRACKET:
                const token = this.lookaheadToken(0);
                if (token.type === Token.TOK_NUMBER || token.type === Token.TOK_COLON) {
                    right = this.parseIndexExpression();
                    return this.projectIfSlice(left, right);
                }
                this.match(Token.TOK_STAR);
                this.match(Token.TOK_RBRACKET);
                right = this.parseProjectionRHS(bindingPower.Star);
                return { type: 'Projection', children: [left, right] };
            default:
                return this.errorToken(this.lookaheadToken(0));
        }
    }
    match(tokenType) {
        if (this.lookahead(0) === tokenType) {
            this.advance();
            return;
        }
        else {
            const token = this.lookaheadToken(0);
            this.errorToken(token, `Expected ${tokenType}, got: ${token.type}`);
        }
    }
    errorToken(token, message = '') {
        const error = new Error(message || `Invalid token (${token.type}): "${token.value}"`);
        error.name = 'ParserError';
        throw error;
    }
    parseIndexExpression() {
        if (this.lookahead(0) === Token.TOK_COLON || this.lookahead(1) === Token.TOK_COLON) {
            return this.parseSliceExpression();
        }
        const node = {
            type: 'Index',
            value: this.lookaheadToken(0).value,
        };
        this.advance();
        this.match(Token.TOK_RBRACKET);
        return node;
    }
    projectIfSlice(left, right) {
        const indexExpr = { type: 'IndexExpression', children: [left, right] };
        if (right.type === 'Slice') {
            return {
                children: [indexExpr, this.parseProjectionRHS(bindingPower.Star)],
                type: 'Projection',
            };
        }
        return indexExpr;
    }
    parseSliceExpression() {
        const parts = [null, null, null];
        let index = 0;
        let currentTokenType = this.lookahead(0);
        while (currentTokenType !== Token.TOK_RBRACKET && index < 3) {
            if (currentTokenType === Token.TOK_COLON) {
                index += 1;
                this.advance();
            }
            else if (currentTokenType === Token.TOK_NUMBER) {
                parts[index] = this.lookaheadToken(0).value;
                this.advance();
            }
            else {
                const token = this.lookaheadToken(0);
                this.errorToken(token, `Syntax error, unexpected token: ${token.value}(${token.type})`);
            }
            currentTokenType = this.lookahead(0);
        }
        this.match(Token.TOK_RBRACKET);
        return {
            children: parts,
            type: 'Slice',
        };
    }
    parseComparator(left, comparator) {
        const right = this.expression(bindingPower[comparator]);
        return { type: 'Comparator', name: comparator, children: [left, right] };
    }
    parseDotRHS(rbp) {
        const lookahead = this.lookahead(0);
        const exprTokens = [Token.TOK_UNQUOTEDIDENTIFIER, Token.TOK_QUOTEDIDENTIFIER, Token.TOK_STAR];
        if (exprTokens.includes(lookahead)) {
            return this.expression(rbp);
        }
        if (lookahead === Token.TOK_LBRACKET) {
            this.match(Token.TOK_LBRACKET);
            return this.parseMultiselectList();
        }
        if (lookahead === Token.TOK_LBRACE) {
            this.match(Token.TOK_LBRACE);
            return this.parseMultiselectHash();
        }
        const token = this.lookaheadToken(0);
        this.errorToken(token, `Syntax error, unexpected token: ${token.value}(${token.type})`);
    }
    parseProjectionRHS(rbp) {
        if (bindingPower[this.lookahead(0)] < 10) {
            return { type: 'Identity' };
        }
        if (this.lookahead(0) === Token.TOK_LBRACKET) {
            return this.expression(rbp);
        }
        if (this.lookahead(0) === Token.TOK_FILTER) {
            return this.expression(rbp);
        }
        if (this.lookahead(0) === Token.TOK_DOT) {
            this.match(Token.TOK_DOT);
            return this.parseDotRHS(rbp);
        }
        const token = this.lookaheadToken(0);
        this.errorToken(token, `Syntax error, unexpected token: ${token.value}(${token.type})`);
    }
    parseMultiselectList() {
        const expressions = [];
        while (this.lookahead(0) !== Token.TOK_RBRACKET) {
            const expression = this.expression(0);
            expressions.push(expression);
            if (this.lookahead(0) === Token.TOK_COMMA) {
                this.match(Token.TOK_COMMA);
                if (this.lookahead(0) === Token.TOK_RBRACKET) {
                    throw new Error('Unexpected token Rbracket');
                }
            }
        }
        this.match(Token.TOK_RBRACKET);
        return { type: 'MultiSelectList', children: expressions };
    }
    parseMultiselectHash() {
        const pairs = [];
        const identifierTypes = [Token.TOK_UNQUOTEDIDENTIFIER, Token.TOK_QUOTEDIDENTIFIER];
        let keyToken;
        let keyName;
        let value;
        // tslint:disable-next-line: prettier
        for (;;) {
            keyToken = this.lookaheadToken(0);
            if (!identifierTypes.includes(keyToken.type)) {
                throw new Error(`Expecting an identifier token, got: ${keyToken.type}`);
            }
            keyName = keyToken.value;
            this.advance();
            this.match(Token.TOK_COLON);
            value = this.expression(0);
            pairs.push({ value, type: 'KeyValuePair', name: keyName });
            if (this.lookahead(0) === Token.TOK_COMMA) {
                this.match(Token.TOK_COMMA);
            }
            else if (this.lookahead(0) === Token.TOK_RBRACE) {
                this.match(Token.TOK_RBRACE);
                break;
            }
        }
        return { type: 'MultiSelectHash', children: pairs };
    }
}
const Parser = new TokenParser();

var InputArgument;
(function (InputArgument) {
    InputArgument[InputArgument["TYPE_NUMBER"] = 0] = "TYPE_NUMBER";
    InputArgument[InputArgument["TYPE_ANY"] = 1] = "TYPE_ANY";
    InputArgument[InputArgument["TYPE_STRING"] = 2] = "TYPE_STRING";
    InputArgument[InputArgument["TYPE_ARRAY"] = 3] = "TYPE_ARRAY";
    InputArgument[InputArgument["TYPE_OBJECT"] = 4] = "TYPE_OBJECT";
    InputArgument[InputArgument["TYPE_BOOLEAN"] = 5] = "TYPE_BOOLEAN";
    InputArgument[InputArgument["TYPE_EXPREF"] = 6] = "TYPE_EXPREF";
    InputArgument[InputArgument["TYPE_NULL"] = 7] = "TYPE_NULL";
    InputArgument[InputArgument["TYPE_ARRAY_NUMBER"] = 8] = "TYPE_ARRAY_NUMBER";
    InputArgument[InputArgument["TYPE_ARRAY_STRING"] = 9] = "TYPE_ARRAY_STRING";
})(InputArgument || (InputArgument = {}));
class Runtime {
    constructor(interpreter) {
        this.TYPE_NAME_TABLE = {
            [InputArgument.TYPE_NUMBER]: 'number',
            [InputArgument.TYPE_ANY]: 'any',
            [InputArgument.TYPE_STRING]: 'string',
            [InputArgument.TYPE_ARRAY]: 'array',
            [InputArgument.TYPE_OBJECT]: 'object',
            [InputArgument.TYPE_BOOLEAN]: 'boolean',
            [InputArgument.TYPE_EXPREF]: 'expression',
            [InputArgument.TYPE_NULL]: 'null',
            [InputArgument.TYPE_ARRAY_NUMBER]: 'Array<number>',
            [InputArgument.TYPE_ARRAY_STRING]: 'Array<string>',
        };
        this.functionAbs = ([inputValue]) => {
            return Math.abs(inputValue);
        };
        this.functionAvg = ([inputArray]) => {
            let sum = 0;
            for (let i = 0; i < inputArray.length; i += 1) {
                sum += inputArray[i];
            }
            return sum / inputArray.length;
        };
        this.functionCeil = ([inputValue]) => {
            return Math.ceil(inputValue);
        };
        this.functionContains = resolvedArgs => {
            const [searchable, searchValue] = resolvedArgs;
            return searchable.includes(searchValue);
        };
        this.functionEndsWith = resolvedArgs => {
            const [searchStr, suffix] = resolvedArgs;
            return searchStr.includes(suffix, searchStr.length - suffix.length);
        };
        this.functionFloor = ([inputValue]) => {
            return Math.floor(inputValue);
        };
        this.functionJoin = resolvedArgs => {
            const [joinChar, listJoin] = resolvedArgs;
            return listJoin.join(joinChar);
        };
        this.functionKeys = ([inputObject]) => {
            return Object.keys(inputObject);
        };
        this.functionLength = ([inputValue]) => {
            if (!isObject(inputValue)) {
                return inputValue.length;
            }
            return Object.keys(inputValue).length;
        };
        this.functionMap = (resolvedArgs) => {
            if (!this._interpreter) {
                return [];
            }
            const mapped = [];
            const interpreter = this._interpreter;
            const exprefNode = resolvedArgs[0];
            const elements = resolvedArgs[1];
            for (let i = 0; i < elements.length; i += 1) {
                mapped.push(interpreter.visit(exprefNode, elements[i]));
            }
            return mapped;
        };
        this.functionMax = ([inputValue]) => {
            if (!inputValue.length) {
                return null;
            }
            const typeName = this.getTypeName(inputValue[0]);
            if (typeName === InputArgument.TYPE_NUMBER) {
                return Math.max(...inputValue);
            }
            const elements = inputValue;
            let maxElement = elements[0];
            for (let i = 1; i < elements.length; i += 1) {
                if (maxElement.localeCompare(elements[i]) < 0) {
                    maxElement = elements[i];
                }
            }
            return maxElement;
        };
        this.functionMaxBy = (resolvedArgs) => {
            const exprefNode = resolvedArgs[1];
            const resolvedArray = resolvedArgs[0];
            const keyFunction = this.createKeyFunction(exprefNode, [InputArgument.TYPE_NUMBER, InputArgument.TYPE_STRING]);
            let maxNumber = -Infinity;
            let maxRecord;
            let current;
            for (let i = 0; i < resolvedArray.length; i += 1) {
                current = keyFunction && keyFunction(resolvedArray[i]);
                if (current !== undefined && current > maxNumber) {
                    maxNumber = current;
                    maxRecord = resolvedArray[i];
                }
            }
            return maxRecord;
        };
        this.functionMerge = resolvedArgs => {
            let merged = {};
            for (let i = 0; i < resolvedArgs.length; i += 1) {
                const current = resolvedArgs[i];
                merged = Object.assign(merged, current);
                // for (const key in current) {
                //   merged[key] = current[key];
                // }
            }
            return merged;
        };
        this.functionMin = ([inputValue]) => {
            if (!inputValue.length) {
                return null;
            }
            const typeName = this.getTypeName(inputValue[0]);
            if (typeName === InputArgument.TYPE_NUMBER) {
                return Math.min(...inputValue);
            }
            const elements = inputValue;
            let minElement = elements[0];
            for (let i = 1; i < elements.length; i += 1) {
                if (elements[i].localeCompare(minElement) < 0) {
                    minElement = elements[i];
                }
            }
            return minElement;
        };
        this.functionMinBy = (resolvedArgs) => {
            const exprefNode = resolvedArgs[1];
            const resolvedArray = resolvedArgs[0];
            const keyFunction = this.createKeyFunction(exprefNode, [InputArgument.TYPE_NUMBER, InputArgument.TYPE_STRING]);
            let minNumber = Infinity;
            let minRecord;
            let current;
            for (let i = 0; i < resolvedArray.length; i += 1) {
                current = keyFunction && keyFunction(resolvedArray[i]);
                if (current !== undefined && current < minNumber) {
                    minNumber = current;
                    minRecord = resolvedArray[i];
                }
            }
            return minRecord;
        };
        this.functionNotNull = (resolvedArgs) => {
            for (let i = 0; i < resolvedArgs.length; i += 1) {
                if (this.getTypeName(resolvedArgs[i]) !== InputArgument.TYPE_NULL) {
                    return resolvedArgs[i];
                }
            }
            return null;
        };
        this.functionReverse = ([inputValue]) => {
            const typeName = this.getTypeName(inputValue);
            if (typeName === InputArgument.TYPE_STRING) {
                const originalStr = inputValue;
                let reversedStr = '';
                for (let i = originalStr.length - 1; i >= 0; i -= 1) {
                    reversedStr += originalStr[i];
                }
                return reversedStr;
            }
            const reversedArray = inputValue.slice(0);
            reversedArray.reverse();
            return reversedArray;
        };
        this.functionSort = ([inputValue]) => {
            return [...inputValue].sort();
        };
        this.functionSortBy = (resolvedArgs) => {
            if (!this._interpreter) {
                return [];
            }
            const sortedArray = resolvedArgs[0].slice(0);
            if (sortedArray.length === 0) {
                return sortedArray;
            }
            const interpreter = this._interpreter;
            const exprefNode = resolvedArgs[1];
            const requiredType = this.getTypeName(interpreter.visit(exprefNode, sortedArray[0]));
            if (requiredType !== undefined && ![InputArgument.TYPE_NUMBER, InputArgument.TYPE_STRING].includes(requiredType)) {
                throw new Error(`TypeError: unexpected type (${this.TYPE_NAME_TABLE[requiredType]})`);
            }
            const decorated = [];
            for (let i = 0; i < sortedArray.length; i += 1) {
                decorated.push([i, sortedArray[i]]);
            }
            decorated.sort((a, b) => {
                const exprA = interpreter.visit(exprefNode, a[1]);
                const exprB = interpreter.visit(exprefNode, b[1]);
                if (this.getTypeName(exprA) !== requiredType) {
                    throw new Error(`TypeError: expected (${this.TYPE_NAME_TABLE[requiredType]}), received ${this.TYPE_NAME_TABLE[this.getTypeName(exprA)]}`);
                }
                else if (this.getTypeName(exprB) !== requiredType) {
                    throw new Error(`TypeError: expected (${this.TYPE_NAME_TABLE[requiredType]}), received ${this.TYPE_NAME_TABLE[this.getTypeName(exprB)]}`);
                }
                if (exprA > exprB) {
                    return 1;
                }
                return exprA < exprB ? -1 : a[0] - b[0];
            });
            for (let j = 0; j < decorated.length; j += 1) {
                sortedArray[j] = decorated[j][1];
            }
            return sortedArray;
        };
        this.functionStartsWith = ([searchable, searchStr]) => {
            return searchable.startsWith(searchStr);
        };
        this.functionSum = ([inputValue]) => {
            return inputValue.reduce((x, y) => x + y, 0);
        };
        this.functionToArray = ([inputValue]) => {
            if (this.getTypeName(inputValue) === InputArgument.TYPE_ARRAY) {
                return inputValue;
            }
            return [inputValue];
        };
        this.functionToNumber = ([inputValue]) => {
            const typeName = this.getTypeName(inputValue);
            let convertedValue;
            if (typeName === InputArgument.TYPE_NUMBER) {
                return inputValue;
            }
            if (typeName === InputArgument.TYPE_STRING) {
                convertedValue = +inputValue;
                if (!isNaN(convertedValue)) {
                    return convertedValue;
                }
            }
            return null;
        };
        this.functionToString = ([inputValue]) => {
            if (this.getTypeName(inputValue) === InputArgument.TYPE_STRING) {
                return inputValue;
            }
            return JSON.stringify(inputValue);
        };
        this.functionType = ([inputValue]) => {
            switch (this.getTypeName(inputValue)) {
                case InputArgument.TYPE_NUMBER:
                    return 'number';
                case InputArgument.TYPE_STRING:
                    return 'string';
                case InputArgument.TYPE_ARRAY:
                    return 'array';
                case InputArgument.TYPE_OBJECT:
                    return 'object';
                case InputArgument.TYPE_BOOLEAN:
                    return 'boolean';
                case InputArgument.TYPE_EXPREF:
                    return 'expref';
                case InputArgument.TYPE_NULL:
                    return 'null';
                default:
                    return;
            }
        };
        this.functionValues = ([inputObject]) => {
            return Object.values(inputObject);
        };
        this.functionTable = {
            abs: {
                _func: this.functionAbs,
                _signature: [
                    {
                        types: [InputArgument.TYPE_NUMBER],
                    },
                ],
            },
            avg: {
                _func: this.functionAvg,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ARRAY_NUMBER],
                    },
                ],
            },
            ceil: {
                _func: this.functionCeil,
                _signature: [
                    {
                        types: [InputArgument.TYPE_NUMBER],
                    },
                ],
            },
            contains: {
                _func: this.functionContains,
                _signature: [
                    {
                        types: [InputArgument.TYPE_STRING, InputArgument.TYPE_ARRAY],
                    },
                    {
                        types: [InputArgument.TYPE_ANY],
                    },
                ],
            },
            ends_with: {
                _func: this.functionEndsWith,
                _signature: [
                    {
                        types: [InputArgument.TYPE_STRING],
                    },
                    {
                        types: [InputArgument.TYPE_STRING],
                    },
                ],
            },
            floor: {
                _func: this.functionFloor,
                _signature: [
                    {
                        types: [InputArgument.TYPE_NUMBER],
                    },
                ],
            },
            join: {
                _func: this.functionJoin,
                _signature: [
                    {
                        types: [InputArgument.TYPE_STRING],
                    },
                    {
                        types: [InputArgument.TYPE_ARRAY_STRING],
                    },
                ],
            },
            keys: {
                _func: this.functionKeys,
                _signature: [
                    {
                        types: [InputArgument.TYPE_OBJECT],
                    },
                ],
            },
            length: {
                _func: this.functionLength,
                _signature: [
                    {
                        types: [InputArgument.TYPE_STRING, InputArgument.TYPE_ARRAY, InputArgument.TYPE_OBJECT],
                    },
                ],
            },
            map: {
                _func: this.functionMap,
                _signature: [
                    {
                        types: [InputArgument.TYPE_EXPREF],
                    },
                    {
                        types: [InputArgument.TYPE_ARRAY],
                    },
                ],
            },
            max: {
                _func: this.functionMax,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ARRAY_NUMBER, InputArgument.TYPE_ARRAY_STRING],
                    },
                ],
            },
            max_by: {
                _func: this.functionMaxBy,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ARRAY],
                    },
                    {
                        types: [InputArgument.TYPE_EXPREF],
                    },
                ],
            },
            merge: {
                _func: this.functionMerge,
                _signature: [
                    {
                        types: [InputArgument.TYPE_OBJECT],
                        variadic: true,
                    },
                ],
            },
            min: {
                _func: this.functionMin,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ARRAY_NUMBER, InputArgument.TYPE_ARRAY_STRING],
                    },
                ],
            },
            min_by: {
                _func: this.functionMinBy,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ARRAY],
                    },
                    {
                        types: [InputArgument.TYPE_EXPREF],
                    },
                ],
            },
            not_null: {
                _func: this.functionNotNull,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ANY],
                        variadic: true,
                    },
                ],
            },
            reverse: {
                _func: this.functionReverse,
                _signature: [
                    {
                        types: [InputArgument.TYPE_STRING, InputArgument.TYPE_ARRAY],
                    },
                ],
            },
            sort: {
                _func: this.functionSort,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ARRAY_STRING, InputArgument.TYPE_ARRAY_NUMBER],
                    },
                ],
            },
            sort_by: {
                _func: this.functionSortBy,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ARRAY],
                    },
                    {
                        types: [InputArgument.TYPE_EXPREF],
                    },
                ],
            },
            starts_with: {
                _func: this.functionStartsWith,
                _signature: [
                    {
                        types: [InputArgument.TYPE_STRING],
                    },
                    {
                        types: [InputArgument.TYPE_STRING],
                    },
                ],
            },
            sum: {
                _func: this.functionSum,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ARRAY_NUMBER],
                    },
                ],
            },
            to_array: {
                _func: this.functionToArray,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ANY],
                    },
                ],
            },
            to_number: {
                _func: this.functionToNumber,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ANY],
                    },
                ],
            },
            to_string: {
                _func: this.functionToString,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ANY],
                    },
                ],
            },
            type: {
                _func: this.functionType,
                _signature: [
                    {
                        types: [InputArgument.TYPE_ANY],
                    },
                ],
            },
            values: {
                _func: this.functionValues,
                _signature: [
                    {
                        types: [InputArgument.TYPE_OBJECT],
                    },
                ],
            },
        };
        this._interpreter = interpreter;
    }
    registerFunction(name, customFunction, signature) {
        if (name in this.functionTable) {
            throw new Error(`Function already defined: ${name}()`);
        }
        this.functionTable[name] = {
            _func: customFunction.bind(this),
            _signature: signature,
        };
    }
    callFunction(name, resolvedArgs) {
        const functionEntry = this.functionTable[name];
        if (functionEntry === undefined) {
            throw new Error(`Unknown function: ${name}()`);
        }
        this.validateArgs(name, resolvedArgs, functionEntry._signature);
        return functionEntry._func.call(this, resolvedArgs);
    }
    validateInputSignatures(name, signature) {
        for (let i = 0; i < signature.length; i += 1) {
            if ('variadic' in signature[i] && i !== signature.length - 1) {
                throw new Error(`ArgumentError: ${name}() 'variadic' argument ${i + 1} must occur last`);
            }
        }
    }
    validateArgs(name, args, signature) {
        var _a, _b;
        let pluralized;
        this.validateInputSignatures(name, signature);
        const numberOfRequiredArgs = signature.filter(argSignature => { var _a; return (_a = !argSignature.optional) !== null && _a !== void 0 ? _a : false; }).length;
        const lastArgIsVariadic = (_b = (_a = signature[signature.length - 1]) === null || _a === void 0 ? void 0 : _a.variadic) !== null && _b !== void 0 ? _b : false;
        const tooFewArgs = args.length < numberOfRequiredArgs;
        const tooManyArgs = args.length > signature.length;
        const tooFewModifier = tooFewArgs && ((!lastArgIsVariadic && numberOfRequiredArgs > 1) || lastArgIsVariadic) ? 'at least ' : '';
        if ((lastArgIsVariadic && tooFewArgs) || (!lastArgIsVariadic && (tooFewArgs || tooManyArgs))) {
            pluralized = signature.length > 1;
            throw new Error(`ArgumentError: ${name}() takes ${tooFewModifier}${numberOfRequiredArgs} argument${(pluralized && 's') || ''} but received ${args.length}`);
        }
        let currentSpec;
        let actualType;
        let typeMatched;
        for (let i = 0; i < signature.length; i += 1) {
            typeMatched = false;
            currentSpec = signature[i].types;
            actualType = this.getTypeName(args[i]);
            let j;
            for (j = 0; j < currentSpec.length; j += 1) {
                if (actualType !== undefined && this.typeMatches(actualType, currentSpec[j], args[i])) {
                    typeMatched = true;
                    break;
                }
            }
            if (!typeMatched && actualType !== undefined) {
                const expected = currentSpec
                    .map((typeIdentifier) => {
                    return this.TYPE_NAME_TABLE[typeIdentifier];
                })
                    .join(' | ');
                throw new Error(`TypeError: ${name}() expected argument ${i + 1} to be type (${expected}) but received type ${this.TYPE_NAME_TABLE[actualType]} instead.`);
            }
        }
    }
    typeMatches(actual, expected, argValue) {
        if (expected === InputArgument.TYPE_ANY) {
            return true;
        }
        if (expected === InputArgument.TYPE_ARRAY_STRING ||
            expected === InputArgument.TYPE_ARRAY_NUMBER ||
            expected === InputArgument.TYPE_ARRAY) {
            if (expected === InputArgument.TYPE_ARRAY) {
                return actual === InputArgument.TYPE_ARRAY;
            }
            if (actual === InputArgument.TYPE_ARRAY) {
                let subtype;
                if (expected === InputArgument.TYPE_ARRAY_NUMBER) {
                    subtype = InputArgument.TYPE_NUMBER;
                }
                else if (expected === InputArgument.TYPE_ARRAY_STRING) {
                    subtype = InputArgument.TYPE_STRING;
                }
                for (let i = 0; i < argValue.length; i += 1) {
                    const typeName = this.getTypeName(argValue[i]);
                    if (typeName !== undefined && subtype !== undefined && !this.typeMatches(typeName, subtype, argValue[i])) {
                        return false;
                    }
                }
                return true;
            }
        }
        else {
            return actual === expected;
        }
        return false;
    }
    getTypeName(obj) {
        switch (Object.prototype.toString.call(obj)) {
            case '[object String]':
                return InputArgument.TYPE_STRING;
            case '[object Number]':
                return InputArgument.TYPE_NUMBER;
            case '[object Array]':
                return InputArgument.TYPE_ARRAY;
            case '[object Boolean]':
                return InputArgument.TYPE_BOOLEAN;
            case '[object Null]':
                return InputArgument.TYPE_NULL;
            case '[object Object]':
                if (obj.jmespathType === Token.TOK_EXPREF) {
                    return InputArgument.TYPE_EXPREF;
                }
                return InputArgument.TYPE_OBJECT;
            default:
                return;
        }
    }
    createKeyFunction(exprefNode, allowedTypes) {
        if (!this._interpreter) {
            return;
        }
        const interpreter = this._interpreter;
        const keyFunc = (x) => {
            const current = interpreter.visit(exprefNode, x);
            if (!allowedTypes.includes(this.getTypeName(current))) {
                const msg = `TypeError: expected one of (${allowedTypes
                    .map(t => this.TYPE_NAME_TABLE[t])
                    .join(' | ')}), received ${this.TYPE_NAME_TABLE[this.getTypeName(current)]}`;
                throw new Error(msg);
            }
            return current;
        };
        return keyFunc;
    }
}

class TreeInterpreter$1 {
    constructor() {
        this._rootValue = null;
        this.runtime = new Runtime(this);
    }
    search(node, value) {
        this._rootValue = value;
        return this.visit(node, value);
    }
    visit(node, value) {
        let matched;
        let current;
        let result;
        let first;
        let second;
        let field;
        let left;
        let right;
        let collected;
        let i;
        let base;
        switch (node.type) {
            case 'Field':
                if (value === null) {
                    return null;
                }
                if (isObject(value)) {
                    field = value[node.name];
                    if (field === undefined) {
                        return null;
                    }
                    return field;
                }
                return null;
            case 'Subexpression':
                result = this.visit(node.children[0], value);
                for (i = 1; i < node.children.length; i += 1) {
                    result = this.visit(node.children[1], result);
                    if (result === null) {
                        return null;
                    }
                }
                return result;
            case 'IndexExpression':
                left = this.visit(node.children[0], value);
                right = this.visit(node.children[1], left);
                return right;
            case 'Index':
                if (!Array.isArray(value)) {
                    return null;
                }
                let index = node.value;
                if (index < 0) {
                    index = value.length + index;
                }
                result = value[index];
                if (result === undefined) {
                    result = null;
                }
                return result;
            case 'Slice':
                if (!Array.isArray(value)) {
                    return null;
                }
                const sliceParams = [...node.children];
                const computed = this.computeSliceParams(value.length, sliceParams);
                const [start, stop, step] = computed;
                result = [];
                if (step > 0) {
                    for (i = start; i < stop; i += step) {
                        result.push(value[i]);
                    }
                }
                else {
                    for (i = start; i > stop; i += step) {
                        result.push(value[i]);
                    }
                }
                return result;
            case 'Projection':
                base = this.visit(node.children[0], value);
                if (!Array.isArray(base)) {
                    return null;
                }
                collected = [];
                for (i = 0; i < base.length; i += 1) {
                    current = this.visit(node.children[1], base[i]);
                    if (current !== null) {
                        collected.push(current);
                    }
                }
                return collected;
            case 'ValueProjection':
                base = this.visit(node.children[0], value);
                if (!isObject(base)) {
                    return null;
                }
                collected = [];
                const values = Object.values(base);
                for (i = 0; i < values.length; i += 1) {
                    current = this.visit(node.children[1], values[i]);
                    if (current !== null) {
                        collected.push(current);
                    }
                }
                return collected;
            case 'FilterProjection':
                base = this.visit(node.children[0], value);
                if (!Array.isArray(base)) {
                    return null;
                }
                const filtered = [];
                const finalResults = [];
                for (i = 0; i < base.length; i += 1) {
                    matched = this.visit(node.children[2], base[i]);
                    if (!isFalse(matched)) {
                        filtered.push(base[i]);
                    }
                }
                for (let j = 0; j < filtered.length; j += 1) {
                    current = this.visit(node.children[1], filtered[j]);
                    if (current !== null) {
                        finalResults.push(current);
                    }
                }
                return finalResults;
            case 'Comparator':
                first = this.visit(node.children[0], value);
                second = this.visit(node.children[1], value);
                switch (node.name) {
                    case Token.TOK_EQ:
                        result = strictDeepEqual(first, second);
                        break;
                    case Token.TOK_NE:
                        result = !strictDeepEqual(first, second);
                        break;
                    case Token.TOK_GT:
                        result = first > second;
                        break;
                    case Token.TOK_GTE:
                        result = first >= second;
                        break;
                    case Token.TOK_LT:
                        result = first < second;
                        break;
                    case Token.TOK_LTE:
                        result = first <= second;
                        break;
                    default:
                        throw new Error(`Unknown comparator: ${node.name}`);
                }
                return result;
            case Token.TOK_FLATTEN:
                const original = this.visit(node.children[0], value);
                if (!Array.isArray(original)) {
                    return null;
                }
                let merged = [];
                for (i = 0; i < original.length; i += 1) {
                    current = original[i];
                    if (Array.isArray(current)) {
                        merged = [...merged, ...current];
                    }
                    else {
                        merged.push(current);
                    }
                }
                return merged;
            case 'Identity':
                return value;
            case 'MultiSelectList':
                if (value === null) {
                    return null;
                }
                collected = [];
                for (i = 0; i < node.children.length; i += 1) {
                    collected.push(this.visit(node.children[i], value));
                }
                return collected;
            case 'MultiSelectHash':
                if (value === null) {
                    return null;
                }
                collected = {};
                let child;
                for (i = 0; i < node.children.length; i += 1) {
                    child = node.children[i];
                    collected[child.name] = this.visit(child.value, value);
                }
                return collected;
            case 'OrExpression':
                matched = this.visit(node.children[0], value);
                if (isFalse(matched)) {
                    matched = this.visit(node.children[1], value);
                }
                return matched;
            case 'AndExpression':
                first = this.visit(node.children[0], value);
                if (isFalse(first)) {
                    return first;
                }
                return this.visit(node.children[1], value);
            case 'NotExpression':
                first = this.visit(node.children[0], value);
                return isFalse(first);
            case 'Literal':
                return node.value;
            case Token.TOK_PIPE:
                left = this.visit(node.children[0], value);
                return this.visit(node.children[1], left);
            case Token.TOK_CURRENT:
                return value;
            case Token.TOK_ROOT:
                return this._rootValue;
            case 'Function':
                const resolvedArgs = [];
                for (let j = 0; j < node.children.length; j += 1) {
                    resolvedArgs.push(this.visit(node.children[j], value));
                }
                return this.runtime.callFunction(node.name, resolvedArgs);
            case 'ExpressionReference':
                const refNode = node.children[0];
                refNode.jmespathType = Token.TOK_EXPREF;
                return refNode;
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }
    computeSliceParams(arrayLength, sliceParams) {
        let [start, stop, step] = sliceParams;
        if (step === null) {
            step = 1;
        }
        else if (step === 0) {
            const error = new Error('Invalid slice, step cannot be 0');
            error.name = 'RuntimeError';
            throw error;
        }
        const stepValueNegative = step < 0 ? true : false;
        start = start === null ? (stepValueNegative ? arrayLength - 1 : 0) : this.capSliceRange(arrayLength, start, step);
        stop = stop === null ? (stepValueNegative ? -1 : arrayLength) : this.capSliceRange(arrayLength, stop, step);
        return [start, stop, step];
    }
    capSliceRange(arrayLength, actualValue, step) {
        let nextActualValue = actualValue;
        if (nextActualValue < 0) {
            nextActualValue += arrayLength;
            if (nextActualValue < 0) {
                nextActualValue = step < 0 ? -1 : 0;
            }
        }
        else if (nextActualValue >= arrayLength) {
            nextActualValue = step < 0 ? arrayLength - 1 : arrayLength;
        }
        return nextActualValue;
    }
}
const TreeInterpreterInstance = new TreeInterpreter$1();

const TYPE_ANY = InputArgument.TYPE_ANY;
const TYPE_ARRAY = InputArgument.TYPE_ARRAY;
const TYPE_ARRAY_NUMBER = InputArgument.TYPE_ARRAY_NUMBER;
const TYPE_ARRAY_STRING = InputArgument.TYPE_ARRAY_STRING;
const TYPE_BOOLEAN = InputArgument.TYPE_BOOLEAN;
const TYPE_EXPREF = InputArgument.TYPE_EXPREF;
const TYPE_NULL = InputArgument.TYPE_NULL;
const TYPE_NUMBER = InputArgument.TYPE_NUMBER;
const TYPE_OBJECT = InputArgument.TYPE_OBJECT;
const TYPE_STRING = InputArgument.TYPE_STRING;
function compile(expression) {
    const nodeTree = Parser.parse(expression);
    return nodeTree;
}
function tokenize(expression) {
    return Lexer.tokenize(expression);
}
const registerFunction = (functionName, customFunction, signature) => {
    TreeInterpreterInstance.runtime.registerFunction(functionName, customFunction, signature);
};
function search(data, expression) {
    const nodeTree = Parser.parse(expression);
    return TreeInterpreterInstance.search(nodeTree, data);
}
const TreeInterpreter = TreeInterpreterInstance;
const jmespath = {
    compile,
    registerFunction,
    search,
    tokenize,
    TreeInterpreter,
    TYPE_ANY,
    TYPE_ARRAY_NUMBER,
    TYPE_ARRAY_STRING,
    TYPE_ARRAY,
    TYPE_BOOLEAN,
    TYPE_EXPREF,
    TYPE_NULL,
    TYPE_NUMBER,
    TYPE_OBJECT,
    TYPE_STRING,
};

const EXPRESSION_CACHE = {};
const query = async (path, json) => {
  if (!(path in EXPRESSION_CACHE)) {
    EXPRESSION_CACHE[path] = jmespath.compile(path);
  }
  const result = TreeInterpreter.search(EXPRESSION_CACHE[path], JSON.parse(json));
  return JSON.stringify(result, null, 2);
};

exports.query = query;
})();
