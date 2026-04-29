from collections import Counter

def min_operations(n, arr):
    freq = Counter(arr)
    max_freq = max(freq.values())
    
    return n - max_freq


# Input handling
n = int(input())
arr = list(map(int, input().split()))

print(min_operations(n, arr))