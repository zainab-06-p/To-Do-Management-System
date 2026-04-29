import sys

def min_cost_path(n, m, grid):
    INF = float('inf')
    
    dp = [[INF] * m for _ in range(n)]
    
    dp[0][0] = grid[0][0]
    
    for i in range(n):
        for j in range(m):
            if i == 0 and j == 0:
                continue
            
            # From top
            if i > 0:
                dp[i][j] = min(dp[i][j], dp[i-1][j] + grid[i][j])
            
            # From left
            if j > 0:
                dp[i][j] = min(dp[i][j], dp[i][j-1] + grid[i][j])
            
            # From diagonal (conditional)
            if i > 0 and j > 0:
                if (grid[i][j] + grid[i-1][j-1]) % 2 == 0:
                    dp[i][j] = min(dp[i][j], dp[i-1][j-1] + grid[i][j])
    
    return dp[n-1][m-1] if dp[n-1][m-1] != INF else -1


# Input
n, m = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(n)]

print(min_cost_path(n, m, grid))