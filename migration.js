const MIGRATION_KEY = "controle-empresas-taxi:migrated-to-firestore";
const OLD_STORAGE_KEY = "controle-empresas-taxi:v5";

async function migrateLocalStorageToFirestore() {
  const alreadyMigrated = localStorage.getItem(MIGRATION_KEY);

  if (alreadyMigrated === "yes") {
    console.log("Migração já realizada anteriormente.");
    return;
  }

  const saved = localStorage.getItem(OLD_STORAGE_KEY);

  if (!saved) {
    console.log("Nenhum dado antigo encontrado para migrar.");
    return;
  }

  try {
    const parsed = JSON.parse(saved);

    await window.FirestoreSync.saveCloudState({
      ...parsed,
      migratedAt: new Date().toISOString()
    });

    localStorage.setItem(MIGRATION_KEY, "yes");

    console.log("Migração para Firestore concluída com sucesso.");
    alert("Dados antigos migrados para o Firebase com sucesso!");
  } catch (error) {
    console.error("Erro na migração:", error);
    alert("Erro ao migrar dados antigos para o Firebase.");
  }
}

window.AppMigration = {
  migrateLocalStorageToFirestore
};

console.log("Migration carregado");