export function downstream(edges,start){
  const result=new Set([start]);const queue=[start];
  while(queue.length){const id=queue.shift();for(const edge of edges)if(edge.from===id&&!result.has(edge.to)){result.add(edge.to);queue.push(edge.to);}}
  return result;
}
