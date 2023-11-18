#algorithm by ysn(vegetable chicken)
#在上述代码中，我们使用networkx库构建有向图，并根据边的类型为每条边赋予不同的权重
#然后，我们使用迭代的方法计算每个节点的影响力评分。在每次迭代中，我们根据节点的邻居节点的权重和影响力评分来更新节点的评分
#迭代过程会根据阈值约束条件进行停止，以避免无限传播
#最终，我们根据阻尼系数对影响力评分进行调整。最后，输出每个节点的影响力评分
import networkx as nx

def calculate_influence_score(graph, damping_factor=0.85, iterations=10, threshold=10):
    # 创建一个有向图
    G = nx.DiGraph()

    # 添加节点和边到图中
    for node, edges in graph.items():
        for edge in edges:
            target = edge['target']
            edge_type = edge['edgeType']
            G.add_edge(node, target, weight=get_edge_weight(edge_type))

    # 初始化节点的影响力评分
    scores = {node: 10.0 for node in G.nodes()}

    # 进行迭代计算
    for _ in range(iterations):
        prev_scores = scores.copy()
        for node in G.nodes():
            score = 10.0
            for neighbor in G.neighbors(node):
                edge_weight = G.edges[node, neighbor]['weight']  # 修正边的顺序
                neighbor_score = prev_scores[neighbor]
                score += edge_weight * neighbor_score
            scores[node] = score

        # 应用阈值约束条件
        max_delta = max(abs(scores[node] - prev_scores[node]) for node in G.nodes())
        #print("!!!",iterations,max_delta)
        if max_delta < threshold:
            break

    # 根据阻尼系数进行调整
    for node in G.nodes():
        scores[node] *= damping_factor

    return scores

def get_edge_weight(edge_type):
    # 根据边类型返回权重
    if edge_type == 'post':
        return 1.0
    elif edge_type == 'like':
        return 0.8
    elif edge_type == 'dislike':
        return -0.8
    elif edge_type == 'posCite':
        return 1.0
    elif edge_type == 'negCite':
        return -1.0
    else:
        return 0.0

# 示例图的邻接表表示
graph = {
    'people1': [
        {'target': 'post1', 'edgeType': 'post'},
        {'target': 'post2', 'edgeType': 'post'},
        {'target': 'post3', 'edgeType': 'like'},
        {'target': 'post4', 'edgeType': 'like'},
        {'target': 'post5', 'edgeType': 'dislike'},
    ],
    'people2': [
        {'target': 'post1', 'edgeType': 'like'},
        {'target': 'post2', 'edgeType': 'dislike'},
        {'target': 'post3', 'edgeType': 'like'},
    ],
    'people3': [
        {'target': 'post1', 'edgeType': 'like'},
        {'target': 'post4', 'edgeType': 'like'},
        {'target': 'post5', 'edgeType': 'like'},
    ],
    'post1': [
        {'target': 'post2', 'edgeType': 'posCite'},
        {'target': 'post3', 'edgeType': 'negCite'},
    ],
    'post2': [
        {'target': 'post4', 'edgeType': 'posCite'},
    ],
    'post3': [
        {'target': 'post5', 'edgeType': 'negCite'},
    ],
    'post4': [
        {'target': 'post5', 'edgeType': 'posCite'},
    ],
}

# 计算影响力评分
influence_scores = calculate_influence_score(graph)

# 打印每个节点的影响力评分
for node, score in influence_scores.items():
    print(f'{node}: {score}')
