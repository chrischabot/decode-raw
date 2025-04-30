# decode-raw

A command-line tool for decoding raw Ethereum transactions. This tool can decode both standard Ethereum transactions and internal transactions, showing you the transaction details.

## Features

- Decodes standard Ethereum transactions (Legacy, EIP-1559, EIP-2930)
- Handles internal transactions
- Provides detailed transaction information including:
  - Transaction type
  - Chain ID
  - Nonce
  - Gas parameters
  - To/From addresses
  - Value
  - Transaction data
  - Signature information
  - Access lists (for EIP-2930 transactions)

## Installation

```bash
# Clone the repository
git clone https://github.com/chrischabot/decode-raw.git
cd decode-raw

# Install dependencies
npm install

# Build the project
npm run build

# Install globally (optional)
npm install -g .
```

## Usage

```bash
# Basic usage
decode-raw <raw_transaction_hex>

# Example
decode-raw 0xf86c808504a817c80082520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b88016345785d8a00008025a028ef61340bd939bc2195fe537567866003e1a15d3c71ff63e1590620aa636276a067cbe9d8997f761aecb703304b3800ccf555c9f3dc64214b297fb1966a3b6d83
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# For development, you can use npm link to make the command available globally
# This creates a symlink to your local development version
npm link
# Now you can use decode-raw from anywhere
# To unlink when you're done:
npm unlink
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 