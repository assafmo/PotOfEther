# Test

Create a local test net with `testrpc`.  
We create tons of accounts (`-a 1000`) so we'll have fresh accounts to calculate balance when needed.  
If we'll use the same accounts for all tests then sometimes two transactions goes in the same block and this interferes with balance calculations.  
Account 0-9 can be used freely when tests doesn't involve balance calculations.  
When creating a test with balance calculations use `accountIndex++` to get a fresh account index.  

```bash
$ testrpc -a 1000 &
$ truffle test
```