import threading
from collections import defaultdict
import time

# Lock untuk thread-safe updates
_metrics_lock = threading.Lock()

# Global structures untuk metrics
# format: {(method, path, status): count}
request_total = defaultdict(int)

# format: {(method, path): [duration_1, duration_2, ...]}
request_durations = defaultdict(list)

# format: {error_type: count}
error_total = defaultdict(int)

# Bucket standar Prometheus untuk durasi request (detik)
BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1.0, 2.5, 5.0, 7.5, 10.0]

def track_request(method: str, path: str, status: int, duration_seconds: float):
    with _metrics_lock:
        request_total[(method, path, str(status))] += 1
        request_durations[(method, path)].append(duration_seconds)

def track_error(error_type: str):
    with _metrics_lock:
        error_total[error_type] += 1

def get_prometheus_metrics() -> str:
    lines = []
    
    # 1. Output request_total
    lines.append("# HELP request_total Total number of HTTP requests")
    lines.append("# TYPE request_total counter")
    with _metrics_lock:
        for (method, path, status), count in request_total.items():
            lines.append(f'request_total{{method="{method}",path="{path}",status="{status}"}} {count}')
            
    # 2. Output error_total
    lines.append("# HELP error_total Total number of application errors")
    lines.append("# TYPE error_total counter")
    with _metrics_lock:
        for error_type, count in error_total.items():
            lines.append(f'error_total{{type="{error_type}"}} {count}')
            
    # 3. Output request_duration_seconds
    lines.append("# HELP request_duration_seconds HTTP request duration in seconds")
    lines.append("# TYPE request_duration_seconds histogram")
    with _metrics_lock:
        for (method, path), durations in request_durations.items():
            count = len(durations)
            total_sum = sum(durations)
            
            # Hitung bucket
            bucket_counts = [0] * len(BUCKETS)
            for d in durations:
                for idx, limit in enumerate(BUCKETS):
                    if d <= limit:
                        bucket_counts[idx] += 1
                        
            # Prometheus histogram buckets adalah kumulatif
            cumulative = 0
            for idx, limit in enumerate(BUCKETS):
                cumulative = bucket_counts[idx]
                lines.append(f'request_duration_seconds_bucket{{le="{limit}",method="{method}",path="{path}"}} {cumulative}')
            
            lines.append(f'request_duration_seconds_bucket{{le="+Inf",method="{method}",path="{path}"}} {count}')
            lines.append(f'request_duration_seconds_sum{{method="{method}",path="{path}"}} {total_sum:.6f}')
            lines.append(f'request_duration_seconds_count{{method="{method}",path="{path}"}} {count}')
            
    return "\n".join(lines) + "\n"
