// Prueba simple para verificar que los algoritmos produzcan resultados diferentes

console.log("=== PRUEBA DE ALGORITMOS ===");

// Simulación de procesos de prueba
const testProcesses = [
  { name: "P1", arrivalTime: 0, burstTime: 8 },
  { name: "P2", arrivalTime: 1, burstTime: 4 },
  { name: "P3", arrivalTime: 2, burstTime: 2 },
  { name: "P4", arrivalTime: 3, burstTime: 1 }
];

console.log("Procesos de prueba:");
testProcesses.forEach(p => {
  console.log(`${p.name}: Llegada=${p.arrivalTime}ms, Ráfaga=${p.burstTime}ms`);
});

console.log("\n=== ANÁLISIS TEÓRICO ===");

console.log("\n🚂 FCFS (First Come, First Serve):");
console.log("Orden de ejecución: P1 → P2 → P3 → P4");
console.log("- P1: Espera=0, Finaliza=8");
console.log("- P2: Espera=7 (8-1), Finaliza=12");  
console.log("- P3: Espera=10 (12-2), Finaliza=14");
console.log("- P4: Espera=11 (14-3), Finaliza=15");
console.log("Tiempo de espera promedio: (0+7+10+11)/4 = 7.0ms");

console.log("\n⚡ Shortest Process (SP - Preemptive):");
console.log("t=0: P1 inicia");
console.log("t=1: P2 llega (4ms) - P1 sigue (8ms restantes)");
console.log("t=2: P3 llega (2ms) - P3 interrumpe a P1");
console.log("t=3: P4 llega (1ms) - P4 interrumpe a P3");
console.log("t=4: P4 termina - P3 reanuda");
console.log("t=6: P3 termina - P2 inicia");
console.log("t=10: P2 termina - P1 reanuda");
console.log("t=17: P1 termina");

console.log("\nTiempos de espera SP:");
console.log("- P1: Turnaround=17, Espera=17-8=9ms");
console.log("- P2: Turnaround=9 (10-1), Espera=9-4=5ms");
console.log("- P3: Turnaround=4 (6-2), Espera=4-2=2ms");
console.log("- P4: Turnaround=1 (4-3), Espera=1-1=0ms");
console.log("Tiempo de espera promedio: (9+5+2+0)/4 = 4.0ms");

console.log("\n🏆 RESULTADO ESPERADO:");
console.log("SP debería ser MÁS EFICIENTE (4.0ms vs 7.0ms)");
console.log("Si ambos dan el mismo resultado, hay un BUG en la implementación.");
